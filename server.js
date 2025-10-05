const express = require("express");
const logger = require("./logger");
const { pinoHttp } = require("pino-http");
const { globalErrorHandler } = require("./src/middleware");
const app = express();
const port = process.env.PORT || 3000;

app.use(pinoHttp({ logger }));

app.use(express.json());

const routes = require("./src/routes");
app.use("/api", routes);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

// Start server
function startServer() {
  return app.listen(port, () => {
    logger.info(`Smartcar API server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
