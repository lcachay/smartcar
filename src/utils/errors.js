/**
 * Base class for all application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation errors (400)
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.type = "VALIDATION_ERROR";
    this.details = details;
  }
}

/**
 * Business logic errors (400)
 */
class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400);
    this.type = "BAD_REQUEST";
  }
}

/**
 * Resource not found errors (404)
 */
class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
    this.type = "NOT_FOUND";
  }
}

/**
 * External service errors (502)
 */
class ExternalServiceError extends AppError {
  constructor(message, service = "Unknown Service") {
    super(message, 502);
    this.type = "EXTERNAL_SERVICE_ERROR";
    this.service = service;
  }
}

/**
 * Internal server errors (500)
 */
class InternalServerError extends AppError {
  constructor(message) {
    super(message, 500);
    this.type = "INTERNAL_SERVER_ERROR";
  }
}

module.exports = {
  AppError,
  ValidationError,
  BadRequestError,
  NotFoundError,
  ExternalServiceError,
  InternalServerError,
};
