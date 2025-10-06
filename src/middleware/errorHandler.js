const { z } = require("zod");
const { AppError, ValidationError, InternalServerError } = require("../utils/errors");
const logger = require("../../logger");

/**
 * Development error response - includes stack trace and additional debugging info
 */
const sendError = (err, req, res) => {
  const { correlationId } = req;

  logger.error(
    {
      correlationId,
      name: err.name,
      message: err.message,
      statusCode: err.statusCode || 500,
      stack: err.stack,
      timestamp: err.timestamp || new Date().toISOString(),
      type: err.type || "UNKNOWN_ERROR",
      url: req.url,
      method: req.method,
      ...(err.details && { details: err.details }),
      ...(err.service && { service: err.service }),
    },
    "ERROR DETAILS"
  );

  res.status(err.statusCode || 500).json({
    status: "error",
    error: {
      type: err.type || "UNKNOWN_ERROR",
      message: err.message,
      ...(err.details && { details: err.details }),
      ...(err.service && { service: err.service }),
    },
    stack: err.stack,
    timestamp: err.timestamp || new Date().toISOString(),
  });
};

/**
 * Handle Zod validation errors
 */
const handleZodError = (err) => {
  const validationErrors = err.issues.map((issue) => ({
    field: issue.path.join(".") || "unknown",
    message: issue.message,
    code: issue.code,
  }));

  return new ValidationError("Validation failed", validationErrors);
};

/**
 * Centralized Error Handling Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err instanceof z.ZodError) {
    error = handleZodError(err);
  } else if (!(err instanceof AppError)) {
    // If it's not one of our custom errors, wrap it
    error = new InternalServerError(err.message || "Something went wrong!");
  }
  sendError(error, req, res);
};

/**
 * Handle unhandled routes (404)
 */
const handleNotFound = (req, res, next) => {
  const { correlationId } = req;

  logger.warn(
    {
      correlationId,
      url: req.originalUrl,
      method: req.method,
    },
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  err.type = "NOT_FOUND";
  next(err);
};

module.exports = {
  globalErrorHandler,
  handleNotFound,
};
