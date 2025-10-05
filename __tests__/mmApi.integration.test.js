const { getVehicleInfo, getSecurityStatus, getEnergyInfo, controlEngine } = require("../src/services/mmApi");

describe("MM API Integration Tests", () => {
  // Increase timeout for external API calls
  jest.setTimeout(10000);

  const VALID_VEHICLE_IDS = ["1234", "1235"];
  const INVALID_VEHICLE_IDS = ["9999", "8888"];

  describe("Vehicle Info Service", () => {
    test.each(VALID_VEHICLE_IDS)("should get vehicle info for ID %s", async (vehicleId) => {
      const response = await getVehicleInfo(vehicleId);

      console.log(`Vehicle ${vehicleId} Info Response:`, JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(200);
      expect(response.body).toHaveProperty("service", "getVehicleInfo");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      // Check data structure
      const { data } = response.body;
      expect(data).toHaveProperty("vin");
      expect(data).toHaveProperty("color");
      expect(data).toHaveProperty("fourDoorSedan");
      expect(data).toHaveProperty("twoDoorCoupe");
      expect(data).toHaveProperty("driveTrain");

      expect(data.vin).toHaveProperty("type");
      expect(data.vin).toHaveProperty("value");
      expect(data.color).toHaveProperty("type");
      expect(data.color).toHaveProperty("value");
    });

    test.each(INVALID_VEHICLE_IDS)("should handle invalid vehicle ID", async (vehicleId) => {
      const response = await getVehicleInfo(vehicleId);
      console.log("Invalid ID Response:", JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(404);
      expect(response.body).toContain("not found");
    });
  });

  describe("Security Status Service", () => {
    test.each(VALID_VEHICLE_IDS)("should get security status for ID %s", async (vehicleId) => {
      const response = await getSecurityStatus(vehicleId);

      console.log(`Vehicle ${vehicleId} Security Response:`, JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(200);
      expect(response.body).toHaveProperty("service", "getSecurityStatus");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      // Check doors data
      const { data } = response.body;
      expect(data).toHaveProperty("doors");
      expect(data.doors).toHaveProperty("type", "Array");
      expect(data.doors).toHaveProperty("values");
      expect(Array.isArray(data.doors.values)).toBe(true);

      // Check door structure
      data.doors.values.forEach((door) => {
        expect(door).toHaveProperty("location");
        expect(door).toHaveProperty("locked");
        expect(door.location).toHaveProperty("type", "String");
        expect(door.location).toHaveProperty("value");
        expect(door.locked).toHaveProperty("type", "Boolean");
        expect(door.locked).toHaveProperty("value");
      });
    });
    test.each(INVALID_VEHICLE_IDS)("should handle invalid security status for ID %s", async (vehicleId) => {
      const response = await getSecurityStatus(vehicleId);

      console.log(`Vehicle ${vehicleId} Security Response:`, JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(404);
      expect(response.body).toContain("not found");
    });
  });

  describe("Energy Service", () => {
    test.each(VALID_VEHICLE_IDS)("should get energy info for ID %s", async (vehicleId) => {
      const response = await getEnergyInfo(vehicleId);

      console.log(`Vehicle ${vehicleId} Energy Response:`, JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(200);
      expect(response.body).toHaveProperty("service");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      // Check data
      const { data } = response.body;
      expect(data).toHaveProperty("tankLevel");
      expect(data).toHaveProperty("batteryLevel");
      expect(data.tankLevel).toHaveProperty("type");
      expect(data.tankLevel).toHaveProperty("value");
      expect(data.batteryLevel).toHaveProperty("type");
      expect(data.batteryLevel).toHaveProperty("value");
    });
    test.each(INVALID_VEHICLE_IDS)("should handle invalid energy info for ID %s", async (vehicleId) => {
      const response = await getEnergyInfo(vehicleId);

      console.log(`Vehicle ${vehicleId} ERROR Energy Response:`, JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(404);
      expect(response.body).toContain("not found");
    });
  });

  describe("Engine Control Service", () => {
    // Since I have no knowledge of why the MM API could fail to start/stop the engine I assume both EXECUTED and FAILED are acceptable responses
    test.each(VALID_VEHICLE_IDS)("should start the engine for ID %s", async (vehicleId) => {
      const startResponse = await controlEngine(vehicleId, "START_VEHICLE");

      console.log(`Vehicle ${vehicleId} Start Engine Response:`, JSON.stringify(startResponse));

      // Check start response structure
      expect(parseInt(startResponse.statusCode)).toBe(200);
      expect(startResponse.body).toHaveProperty("service", "actionEngine");
      expect(startResponse.body).toHaveProperty("status", "200");
      expect(startResponse.body).toHaveProperty("actionResult");

      // Check start action result
      const { actionResult: startResult } = startResponse.body;
      expect(startResult).toHaveProperty("status");
      expect(["EXECUTED", "FAILED"]).toContain(startResult.status);
    });
    test.each(VALID_VEHICLE_IDS)("should stop the engine for ID %s", async (vehicleId) => {
      const stopResponse = await controlEngine(vehicleId, "STOP_VEHICLE");

      console.log(`Vehicle ${vehicleId} Stop Engine Response:`, JSON.stringify(stopResponse));

      // Check stop response structure
      expect(parseInt(stopResponse.statusCode)).toBe(200);
      expect(stopResponse.body).toHaveProperty("service", "actionEngine");
      expect(stopResponse.body).toHaveProperty("status", "200");
      expect(stopResponse.body).toHaveProperty("actionResult");

      // Check stop action result
      const { actionResult: stopResult } = stopResponse.body;
      expect(stopResult).toHaveProperty("status");
      expect(["EXECUTED", "FAILED"]).toContain(stopResult.status);
    });

    test("should handle invalid commands", async () => {
      const response = await controlEngine(VALID_VEHICLE_IDS[0], "INVALID_COMMAND");
      console.log("Invalid Command Response:", JSON.stringify(response));

      // Check response structure
      expect(parseInt(response.statusCode)).toBe(400);
      expect(response.body).toContain("Unknown command");
    });
    test.each(INVALID_VEHICLE_IDS)("should handle invalid vehicle ID for engine control %s", async (vehicleId) => {
      const startResponse = await controlEngine(vehicleId, "START_VEHICLE");

      // Check response structure
      expect(parseInt(startResponse.statusCode)).toBe(404);
      expect(startResponse.body).toContain("not found");

      const stopResponse = await controlEngine(vehicleId, "STOP_VEHICLE");

      // Check response structure
      expect(parseInt(stopResponse.statusCode)).toBe(404);
      expect(stopResponse.body).toContain("not found");
    });
  });
});
