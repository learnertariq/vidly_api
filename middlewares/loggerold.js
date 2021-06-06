const debug = require("debug")("app:logger");

const logger = (req, res, next) => {
  console.log("Logger middleware");
  debug("app:logger logging");
  next();
};

module.exports = logger;
