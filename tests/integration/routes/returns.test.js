const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");

const { Movie } = require("../../../models/movie");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let movie;
  let rental;
  let token;

  beforeEach(async () => {
    server = require("../../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      genre: {
        name: "12345",
      },
      title: "12345",
      dailyRentalRate: 2,
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany();
    await Movie.deleteMany();
  });

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({
        customerId,
        movieId,
      });
  };

  it("should work", async () => {
    const result = await Rental.findById(rental._id);

    expect(result._id.toHexString()).toBe(rental._id.toHexString());
  });

  //   // return 401 if user is not logged in
  it("should return 401 if customer is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  //   // return 400 if customerId was not provied
  it("should return 400 if customerId was not provied", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // return 400 if movieId was not provided
  it("should return 400 if movieId was not provied", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  //   // return 404 if no rental found for this customer/movie
  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.deleteMany();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  //   // return 400 if rental already processed
  it("return 400 if rental already processed", async () => {
    rental.dateReturn = Date.now();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  // return 200 if request is valid
  it("should return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  // set the return date
  it("should return set return date", async () => {
    await exec();

    const result = await Rental.findById(rental._id);
    const diff = moment(Date.now()).diff(result.dateReturn, "seconds");

    expect(diff).toBeLessThan(10);
  });

  //   // calculate rental fee
  it("should calculate rental fee", async () => {
    rental.dateOut = moment().add(-7, "days");
    await rental.save();

    await exec();

    const result = await Rental.findById(rental._id);

    expect(result.rentalFee).toBeDefined();
    expect(result.rentalFee).toBe(14);
  });

  //   // increase movie in the stock
  it("should increase movie in the stock", async () => {
    await exec();

    const result = await Movie.findById(movieId);

    expect(result.numberInStock).toBe(movie.numberInStock + 1);
  });

  //   // return the updated rental
  it("should return the updated rental", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturn",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
