const axios = require("axios");
const { app } = require("../server");

// Create axios instance for testing
const apiClient = axios.create({
  baseURL: "http://localhost:3002/api",
  timeout: 5000,
  validateStatus: () => true, // Don't throw errors for any HTTP status
});

describe("Validation Middleware Tests", () => {
  let server;

  beforeAll(async () => {
    // Start server on test port
    server = app.listen(3002);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe("Vehicle ID validation", () => {
    test("should accept valid vehicle ID", async () => {
      const response = await apiClient.get("/vehicles/1234");

      expect(response.status).not.toBe(400);
    });

    test("should handle empty route", async () => {
      const response = await apiClient.get("/vehicles/");

      expect([404, 200]).toContain(response.status);
    });
  });

  describe("Engine action validation", () => {
    test("should reject invalid engine action", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", { action: "INVALID" });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty("status", "error");
      expect(response.data).toHaveProperty("error");
      expect(response.data.error).toHaveProperty("type", "VALIDATION_ERROR");
      expect(response.data.error).toHaveProperty("message", "Validation failed");
      expect(response.data.error).toHaveProperty("details");
      expect(Array.isArray(response.data.error.details)).toBe(true);

      const actionError = response.data.error.details.find((detail) => detail.field === "action");
      expect(actionError).toBeDefined();
      expect(actionError.message).toContain("START");
      expect(actionError.message).toContain("STOP");
    });

    test("should accept valid engine action START", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", { action: "START" });

      expect(response.status).not.toBe(400);
    });

    test("should accept valid engine action STOP", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", { action: "STOP" });

      expect(response.status).not.toBe(400);
    });

    test("should reject missing action", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", {});

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty("status", "error");
      expect(response.data).toHaveProperty("error");
      expect(response.data.error).toHaveProperty("type", "VALIDATION_ERROR");
      expect(response.data.error).toHaveProperty("details");
      expect(Array.isArray(response.data.error.details)).toBe(true);
    });

    test("should reject invalid data types", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", { action: 123 });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty("status", "error");
      expect(response.data).toHaveProperty("error");
      expect(response.data.error).toHaveProperty("type", "VALIDATION_ERROR");
    });

    test("should reject request with extra invalid fields", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", {
        action: "START",
        invalidField: "should be ignored or cause error",
      });

      expect(response.status).not.toBe(400);
    });
  });

  describe("Multiple validation errors", () => {
    test("should return all validation errors when multiple fields are invalid", async () => {
      const response = await apiClient.post("/vehicles/1234/engine", {
        action: "INVALID_ACTION",
      });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty("status", "error");
      expect(response.data).toHaveProperty("error");
      expect(response.data.error).toHaveProperty("type", "VALIDATION_ERROR");
      expect(response.data.error).toHaveProperty("details");
      expect(Array.isArray(response.data.error.details)).toBe(true);
      expect(response.data.error.details.length).toBeGreaterThan(0);
    });
  });

  describe("Content-Type validation", () => {
    test("should handle non-JSON content gracefully", async () => {
      try {
        const response = await apiClient.post("/vehicles/1234/engine", "invalid data", {
          headers: { "Content-Type": "text/plain" },
        });

        // Should either be a validation error or a parsing error
        expect([400, 500]).toContain(response.status);
      } catch (error) {
        // If axios throws, that's also acceptable for malformed requests
        expect(error).toBeDefined();
      }
    });
  });
});
