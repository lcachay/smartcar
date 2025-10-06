const express = require("express");
const logger = require("./logger");
const { pinoHttp } = require("pino-http");
const { globalErrorHandler, addCorrelationId } = require("./src/middleware");
const app = express();
const port = process.env.PORT || 3000;

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
  return app.listen(port, () => {
    logger.info(
      { port, environment: process.env.NODE_ENV || "development" },
      `Smartcar API server running on port ${port}`
    );
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
