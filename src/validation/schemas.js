const { z } = require("zod");

// Vehicle ID validation - must be a non-empty string that could be numeric
const vehicleIdSchema = z.string().min(1, "Vehicle ID is required");

// Engine action validation
const engineActionSchema = z.object({
  action: z.enum(["START", "STOP"], {
    errorMap: () => ({ message: "Action must be either 'START' or 'STOP'" }),
  }),
});

// Request parameter schemas
const vehicleParamsSchema = z.object({
  id: vehicleIdSchema,
});

module.exports = {
  vehicleIdSchema,
  engineActionSchema,
  vehicleParamsSchema,
};
