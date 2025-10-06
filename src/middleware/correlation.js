const { randomUUID } = require("crypto");

/**
 * Middleware to add correlation ID to all requests for tracing
 */
const addCorrelationId = (req, res, next) => {
  // Check if correlation ID is already provided in headers
  const correlationId = req.headers["x-correlation-id"] || randomUUID();

  // Attach to request object for use throughout the request lifecycle
  req.correlationId = correlationId;

  // Add to response headers so clients can track their requests
  res.setHeader("X-Correlation-ID", correlationId);

  next();
};

module.exports = {
  addCorrelationId,
};
