const request = require("supertest");
const mongoose = require("mongoose");
let server;

const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre2")).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exixts", async () => {
      const newId = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + newId);

      expect(res.status).toBe(404);
    });

    it("should return the genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    beforeEach(() => {
      name = "genre1";
      token = new User().generateAuthToken();
    });

    async function exec() {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    }

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre to db if it is valid", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let idUrl;
    let newName;

    beforeEach(async () => {
      token = new User().generateAuthToken();
      const genre = await new Genre({ name: "prevGenre" });
      await genre.save();
      idUrl = genre._id;
      newName = "nextGenre";
    });

    async function exec() {
      return await request(server)
        .put("/api/genres/" + idUrl)
        .set("x-auth-token", token)
        .send({ name: newName });
    }

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if invalid id is passed", async () => {
      idUrl = "1234";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre found with the given id", async () => {
      idUrl = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should update the genre of DB if genre is valid", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "nextGenre" });

      expect(genre).toBeDefined();
    });

    it("should update return the updated genre if genre is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toMatchObject({ name: "nextGenre" });
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let idUrl;

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      const genre = await new Genre({ name: "testGenre" });
      await genre.save();
      idUrl = genre._id;
    });

    function exec() {
      return request(server)
        .delete("/api/genres/" + idUrl)
        .set("x-auth-token", token);
    }

    it("should return 401 if user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not an Admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if invalid genre id is passed", async () => {
      idUrl = "invalidId";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if the genre with the given id doesn't exist", async () => {
      idUrl = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if valid id is passed", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "testGenre" });

      expect(genre).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "testGenre");
    });
  });
});
