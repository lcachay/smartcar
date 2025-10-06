const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smartcar API",
      version: "1.0.0",
      description: "A Node.js API that adapts the Madeup Motors (MM) API into a cleaner Smartcar API format.",
      contact: {
        name: "Smartcar API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Vehicles",
        description: "Vehicle information and control operations",
      },
      {
        name: "Providers",
        description: "Vehicle data provider management and health monitoring",
      },
    ],
    components: {
      schemas: {
        VehicleInfo: {
          type: "object",
          properties: {
            vin: {
              type: "string",
              description: "Vehicle identification number",
              example: "1213231",
            },
            color: {
              type: "string",
              description: "Vehicle color",
              example: "Metallic Silver",
            },
            doorCount: {
              type: "integer",
              description: "Number of doors",
              example: 4,
            },
            driveTrain: {
              type: "string",
              description: "Vehicle drive train type",
              example: "v8",
            },
          },
        },
        DoorStatus: {
          type: "array",
          items: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "Door location",
                example: "frontLeft",
              },
              locked: {
                type: "boolean",
                description: "Lock status",
                example: true,
              },
            },
          },
        },
        EnergyLevel: {
          type: "object",
          properties: {
            percent: {
              type: "number",
              description: "Energy level percentage",
              example: 30,
            },
          },
        },
        EngineAction: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["START", "STOP"],
              description: "Engine action to perform",
              example: "START",
            },
          },
          required: ["action"],
        },
        EngineActionResult: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Action result status",
              example: "success",
            },
          },
        },
        ProviderInfo: {
          type: "object",
          properties: {
            totalProviders: {
              type: "integer",
              description: "Total number of providers",
              example: 1,
            },
            providers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "MM_API",
                  },
                  type: {
                    type: "string",
                    example: "MMApiProvider",
                  },
                },
              },
            },
          },
        },
        ProviderHealth: {
          type: "object",
          properties: {
            summary: {
              type: "object",
              properties: {
                totalProviders: {
                  type: "integer",
                  example: 1,
                },
                healthyProviders: {
                  type: "integer",
                  example: 1,
                },
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
              },
            },
            providers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  provider: {
                    type: "string",
                    example: "MM_API",
                  },
                  status: {
                    type: "string",
                    enum: ["healthy", "unhealthy"],
                    example: "healthy",
                  },
                  responseTimeMs: {
                    type: "number",
                    example: 150,
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Vehicle not found",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
};
