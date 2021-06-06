const express = require("express");
const app = express();
const winston = require("winston");

const { startupDebug } = require("./utils/debug");
startupDebug("startupDebug console logging");

require("./startup/logging")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`app is listening on port ${port}`)
);

module.exports = server;
