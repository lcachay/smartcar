const { z } = require("zod");

/**
 * Generic validation middleware factory
 * @param {Object} schemas - Object containing schemas to validate
 * @param {z.ZodSchema} schemas.body - Schema for request body
 * @param {z.ZodSchema} schemas.params - Schema for request parameters
 * @param {z.ZodSchema} schemas.query - Schema for query parameters
 * @returns {Function} Express middleware function
 */
const validate = (schemas) => {
  return (req, res, next) => {
    try {
      // Validate request parameters
      if (schemas.params) {
        const validatedParams = schemas.params.parse(req.params);
        req.params = validatedParams;
      }

      // Validate request body
      if (schemas.body) {
        const validatedBody = schemas.body.parse(req.body);
        req.body = validatedBody;
      }

      // Validate query parameters
      if (schemas.query) {
        const validatedQuery = schemas.query.parse(req.query);
        req.query = validatedQuery;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Validation failed",
          details: validationErrors,
        });
      }

      // If it's not a Zod error, pass it to the error handler
      next(error);
    }
  };
};

const createValidateVehicleId = () => {
  const vehicleParamsSchema = z.object({
    id: z.string().min(1, "Vehicle ID is required"),
  });

  return validate({
    params: vehicleParamsSchema,
  });
};

const createValidateEngineAction = () => {
  const engineActionSchema = z.object({
    action: z
      .enum(["START", "STOP"], {
        invalid_type_error: "Action must be either 'START' or 'STOP'",
        required_error: "Action is required",
      })
      .refine((val) => ["START", "STOP"].includes(val), {
        message: "Action must be either 'START' or 'STOP'",
      }),
  });

  return validate({
    body: engineActionSchema,
  });
};

// Create middleware instances
const validateVehicleId = createValidateVehicleId();
const validateEngineAction = createValidateEngineAction();

module.exports = {
  validate,
  validateVehicleId,
  validateEngineAction,
};

module.exports = {
  validate,
  validateVehicleId,
  validateEngineAction,
};
