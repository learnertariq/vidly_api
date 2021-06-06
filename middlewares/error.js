const winston = require("winston");

module.exports = function (err, req, res, next) {
  // Logging errors
  winston.error(err.message, err);
  console.log("Something failed... ");
};
