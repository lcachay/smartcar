const express = require("express");
const logger = require("./logger");
const { pinoHttp } = require("pino-http");
const { globalErrorHandler, addCorrelationId } = require("./src/middleware");
const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || "development";

// Add correlation ID to all requests (must be first)
app.use(addCorrelationId);

// Add pino HTTP logging with correlation ID
app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({
      correlationId: req.correlationId,
    }),
  })
);

app.use(express.json());

const routes = require("./src/routes");
app.use("/api", routes);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

// Start server
function startServer() {
  const server = app.listen(port, () => {
    logger.info({ port, environment }, `Smartcar API server running on port ${port}`);
  });

  // Handle server startup errors
  server.on("error", (error) => {
    logger.error(
      {
        port,
        error: error.code,
        message: error.message,
        environment,
      },
      `Failed to start server on port ${port}: ${error.message}`
    );
    process.exit(1);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
