const EventEmitter = require("events");
const emitter = new EventEmitter();

class Logger extends EventEmitter {
  log = () => {
    this.emit("logging", { msg: "App crashed" });
  };
}

module.exports = Logger;
