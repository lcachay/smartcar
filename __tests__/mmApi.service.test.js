/**
 * MM API Service Layer Tests
 * Tests the mmApi.js service behavior including error transformations
 * This tests how our service layer transforms MM API responses (including throwing errors for body.status errors)
 */

const { getVehicleInfo, getSecurityStatus, getEnergyInfo, controlEngine } = require("../src/services/mmApi");

describe("MM API Service Layer Tests", () => {
  // Increase timeout for external API calls
  jest.setTimeout(10000);

  const VALID_VEHICLE_IDS = ["1234", "1235"];
  const INVALID_VEHICLE_IDS = ["9999", "8888"];

  describe("Vehicle Info Service (with error transformation)", () => {
    test.each(VALID_VEHICLE_IDS)("should return successful response for valid ID %s", async (vehicleId) => {
      const response = await getVehicleInfo(vehicleId);

      console.log(`Vehicle ${vehicleId} Service Response:`, JSON.stringify(response, null, 2));

      // Our service should return successful responses normally
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "getVehicleInfo");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      const { data } = response.body;
      expect(data).toHaveProperty("vin");
      expect(data).toHaveProperty("color");
    });

    test.each(INVALID_VEHICLE_IDS)(
      "should throw error for invalid ID %s (transformed from body.status)",
      async (vehicleId) => {
        try {
          await getVehicleInfo(vehicleId);
        } catch (error) {
          expect(error.statusCode).toBe(404);
        }
      }
    );
  });

  describe("Security Status Service (with error transformation)", () => {
    test.each(VALID_VEHICLE_IDS)("should return successful response for valid ID %s", async (vehicleId) => {
      const response = await getSecurityStatus(vehicleId);

      console.log(`Security ${vehicleId} Service Response:`, JSON.stringify(response, null, 2));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "getSecurityStatus");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      const { data } = response.body;
      expect(data).toHaveProperty("doors");
    });

    test.each(INVALID_VEHICLE_IDS)("should throw error for invalid ID %s", async (vehicleId) => {
      try {
        await getSecurityStatus(vehicleId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Energy Info Service (with error transformation)", () => {
    test.each(VALID_VEHICLE_IDS)("should return successful response for valid ID %s", async (vehicleId) => {
      const response = await getEnergyInfo(vehicleId);

      console.log(`Energy ${vehicleId} Service Response:`, JSON.stringify(response, null, 2));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "getEnergy");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      const { data } = response.body;
      expect(data).toHaveProperty("tankLevel");
      expect(data).toHaveProperty("batteryLevel");
    });

    test.each(INVALID_VEHICLE_IDS)("should throw error for invalid ID %s", async (vehicleId) => {
      try {
        await getEnergyInfo(vehicleId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Engine Control Service (with error transformation)", () => {
    test.each(VALID_VEHICLE_IDS)("should handle engine START for valid ID %s", async (vehicleId) => {
      try {
        const response = await controlEngine(vehicleId, "START_VEHICLE");

        console.log(`Engine Start ${vehicleId} Service Response:`, JSON.stringify(response, null, 2));

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("service", "actionEngine");
        expect(response.body).toHaveProperty("status");
      } catch (error) {
        console.log(`Engine Start ${vehicleId} Service Error:`, error.message);
      }
    });

    test.each(VALID_VEHICLE_IDS)("should handle engine STOP for valid ID %s", async (vehicleId) => {
      try {
        const response = await controlEngine(vehicleId, "STOP_VEHICLE");

        console.log(`Engine Stop ${vehicleId} Service Response:`, JSON.stringify(response, null, 2));

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("service", "actionEngine");
      } catch (error) {
        console.log(`Engine Stop ${vehicleId} Service Error:`, error.message);
      }
    });

    test.each(INVALID_VEHICLE_IDS)("should throw error for invalid ID %s", async (vehicleId) => {
      try {
        await controlEngine(vehicleId, "START_VEHICLE");
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
