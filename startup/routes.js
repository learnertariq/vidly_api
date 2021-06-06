const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const errorMiddleware = require("../middlewares/error");

module.exports = function (app) {
  /// system middlewares
  app.use(helmet()); // secure http headers
  app.use(express.json()); // auto parsing json in req.body
  app.use(express.urlencoded({ extended: true })); // to parse url data as json
  app.use(express.static("public")); //

  if (app.get("env") === "development") {
    app.use(morgan("tiny")); // logging http requests
    console.log("Morgan enabled.......");
  }

  /// custom middlewares
  app.use("/api/customers", customers);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(errorMiddleware);
};
