const pino = require("pino");

const logger = pino({
  level: "trace",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
      singleLine: false,
      messageFormat: "{msg}",
      levelFirst: false,
    },
  },
});

module.exports = logger;
