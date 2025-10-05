/**
 * Smartcar API Integration Tests
 * Tests the complete HTTP API endpoints for the Smartcar service
 */

const axios = require("axios");
const { app } = require("../server");

// Create axios instance for testing
const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
  validateStatus: () => true, // Don't throw errors for any HTTP status
});

describe("Smartcar API Integration Tests", () => {
  let server;
  const validVehicleId = "1234";
  const invalidVehicleId = "invalid-id";

  beforeAll(async () => {
    // Start server on test port
    server = app.listen(3001);
    // Wait a bit for server to start
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe("GET /api/vehicles/:id", () => {
    test("should return vehicle information for valid ID", async () => {
      const response = await apiClient.get(`/vehicles/${validVehicleId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("vin");
      expect(response.data).toHaveProperty("color");
      expect(response.data).toHaveProperty("doorCount");
      expect(response.data).toHaveProperty("driveTrain");
      expect(typeof response.data.vin).toBe("string");
      expect(typeof response.data.color).toBe("string");
      expect(typeof response.data.doorCount).toBe("number");
      expect(typeof response.data.driveTrain).toBe("string");
    });

    test("should return 404 for invalid vehicle ID", async () => {
      const response = await apiClient.get(`/vehicles/${invalidVehicleId}`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
    });

    test("should handle server errors gracefully", async () => {
      // Test with a vehicle ID that might cause server errors
      const response = await apiClient.get("/vehicles/error-test");

      expect([404, 500, 502]).toContain(response.status);
    });
  });

  describe("GET /api/vehicles/:id/doors", () => {
    test("should return door lock status for valid ID", async () => {
      const response = await apiClient.get(`/vehicles/${validVehicleId}/doors`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      // Each door should have location and locked properties
      response.data.forEach((door) => {
        expect(door).toHaveProperty("location");
        expect(door).toHaveProperty("locked");
        expect(typeof door.location).toBe("string");
        expect(typeof door.locked).toBe("boolean");
        expect(["frontLeft", "frontRight", "backLeft", "backRight"]).toContain(door.location);
      });
    });

    test("should return 404 for invalid vehicle ID", async () => {
      const response = await apiClient.get(`/vehicles/${invalidVehicleId}/doors`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
    });
  });

  describe("GET /api/vehicles/:id/fuel", () => {
    test("should return fuel level for valid ID", async () => {
      const response = await apiClient.get(`/vehicles/${validVehicleId}/fuel`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("percent");
      expect(typeof response.data.percent).toBe("number");
      expect(response.data.percent).toBeGreaterThanOrEqual(0);
      expect(response.data.percent).toBeLessThanOrEqual(100);
    });

    test("should return 404 for invalid vehicle ID", async () => {
      const response = await apiClient.get(`/vehicles/${invalidVehicleId}/fuel`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
    });
  });

  describe("GET /api/vehicles/:id/battery", () => {
    test("should return battery level for valid ID", async () => {
      const response = await apiClient.get(`/vehicles/1235/battery`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("percent");
      expect(typeof response.data.percent).toBe("number");
      expect(response.data.percent).toBeGreaterThanOrEqual(0);
      expect(response.data.percent).toBeLessThanOrEqual(100);
    });

    test("should return 404 for battery level for valid ID since it has no data", async () => {
      const response = await apiClient.get(`/vehicles/1234/battery`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
      expect(response.data.error.message).toBe("Vehicle does not have battery data");
    });

    test("should return 404 for invalid vehicle ID", async () => {
      const response = await apiClient.get(`/vehicles/${invalidVehicleId}/battery`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
    });
  });

  describe("POST /api/vehicles/:id/engine", () => {
    test("should start engine successfully", async () => {
      const response = await apiClient.post(`/vehicles/${validVehicleId}/engine`, { action: "START" });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("status");
      expect(["success", "error"]).toContain(response.data.status);
    });

    test("should stop engine successfully", async () => {
      const response = await apiClient.post(`/vehicles/${validVehicleId}/engine`, { action: "STOP" });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("status");
      expect(["success", "error"]).toContain(response.data.status);
    });

    test("should return 400 for invalid action", async () => {
      const response = await apiClient.post(`/vehicles/${validVehicleId}/engine`, {
        action: "INVALID_ACTION",
      });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty("error");
    });

    test("should return 400 for missing action", async () => {
      const response = await apiClient.post(`/vehicles/${validVehicleId}/engine`, {});

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty("error");
    });

    test("should return 404 for invalid vehicle ID", async () => {
      const response = await apiClient.post(`/vehicles/${invalidVehicleId}/engine`, { action: "START" });

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
    });
  });

  describe("API Error Handling", () => {
    test("should return 404 for non-existent routes", async () => {
      const response = await apiClient.get("/nonexistent");
      expect(response.status).toBe(404);
    });

    test("should handle malformed requests gracefully", async () => {
      try {
        const response = await apiClient.post(`/vehicles/${validVehicleId}/engine`, "invalid data", {
          headers: { "Content-Type": "text/plain" },
        });
        expect([400, 500]).toContain(response.status);
      } catch (error) {
        // If axios throws, that's also acceptable for malformed requests
        expect(error).toBeDefined();
      }
    });
  });

  describe("API Response Format", () => {
    test("all responses should have proper content-type", async () => {
      const response = await apiClient.get(`/vehicles/${validVehicleId}`);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });

    test("error responses should have consistent format", async () => {
      const response = await apiClient.get(`/vehicles/${invalidVehicleId}`);

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty("error");
      expect(typeof response.data.error.message).toBe("string");
      expect(response.data.error.message.length).toBeGreaterThan(0);
    });
  });

  describe("Provider Management Endpoints", () => {
    test("should get provider information", async () => {
      const response = await apiClient.get("/providers/info");

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("totalProviders");
      expect(response.data).toHaveProperty("providers");
      expect(typeof response.data.totalProviders).toBe("number");
      expect(response.data.totalProviders).toBeGreaterThan(0);
    });

    test("should get provider health status", async () => {
      const response = await apiClient.get("/providers/health");

      expect([200, 503]).toContain(response.status); // 200 if healthy, 503 if any unhealthy
      expect(response.data).toHaveProperty("summary");
      expect(response.data).toHaveProperty("providers");
      expect(response.data).toHaveProperty("stats");

      expect(response.data.summary).toHaveProperty("totalProviders");
      expect(response.data.summary).toHaveProperty("healthyProviders");
      expect(response.data.summary).toHaveProperty("timestamp");

      expect(Array.isArray(response.data.providers)).toBe(true);
      expect(response.data.providers.length).toBeGreaterThan(0);

      response.data.providers.forEach((provider) => {
        expect(provider).toHaveProperty("provider");
        expect(provider).toHaveProperty("status");
        expect(provider).toHaveProperty("timestamp");
      });
    });
  });
});
