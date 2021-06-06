const request = require("supertest");
let server;

const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(() => {
    server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token is passed", async () => {
    token = "1234";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if valid token is passed", async () => {
    const res = await exec();

    expect(res.status).toBe(200);

    await Genre.deleteMany();
  });
});
