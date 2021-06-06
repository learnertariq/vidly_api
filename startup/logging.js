const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function (app) {
  // Adding Global transports
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  if (app.get("env") !== "test") {
    winston.add(
      new winston.transports.MongoDB({
        db: config.get("dbUrl"),
        options: { useUnifiedTopology: true },
      })
    );
  }

  // process.on("uncaughtException", (ex) => {
  //   console.log(ex.message, "hi");
  //   logger.error(ex.message, ex);
  //   process.exit(1);
  // });

  const winstonTransports = [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "logfile.log" }),
  ];

  if (app.get("env") !== "test") {
    winstonTransports.push(
      new winston.transports.MongoDB({
        db: config.get("dbUrl"),
        options: { useUnifiedTopology: true },
      })
    );
  }
  winston.exceptions.handle(winstonTransports);

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
