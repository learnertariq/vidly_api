const config = require("config");
const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  const dbUrl = config.get("dbUrl");
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      winston.info(`Connected to ${dbUrl}`);
    });
};
