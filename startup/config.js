const config = require("config");
const winston = require("winston");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    winston.error("FATAL ERROR: jwtPtivateKey is not defined");
    process.exit(1);
  }
};
