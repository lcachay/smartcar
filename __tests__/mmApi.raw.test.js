const axios = require("axios");

const MM_API_BASE_URL = "https://platform-challenge.smartcar.com";

// Raw MM API request function (bypasses our mmApi.js service layer)
const makeRawMMAPIRequest = async (endpoint, data) => {
  try {
    console.log(`Making raw MM API request to: ${MM_API_BASE_URL}${endpoint}`);
    console.log(`Request data: ${JSON.stringify(data)}`);

    const response = await axios.post(`${MM_API_BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log(`Raw MM API Response Status: ${response.status}`);
    console.log(`Raw MM API Response Body: ${JSON.stringify(response.data)}`);

    // Return raw response without any transformations
    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.data,
    };
  } catch (error) {
    console.error("Raw MM API Error:", error.message);
    if (error.response) {
      return {
        statusCode: error.response.status,
        headers: error.response.headers,
        body: error.response.data,
      };
    }
    throw error;
  }
};

describe("Raw MM API Integration Tests", () => {
  // Increase timeout for external API calls
  jest.setTimeout(10000);

  const VALID_VEHICLE_IDS = ["1234", "1235"];
  const INVALID_VEHICLE_IDS = ["9999", "8888"];

  describe("Raw Vehicle Info API", () => {
    test.each(VALID_VEHICLE_IDS)("should return valid vehicle info for ID %s", async (vehicleId) => {
      const requestData = {
        id: vehicleId,
        responseType: "JSON",
      };

      const response = await makeRawMMAPIRequest("/v1/getVehicleInfoService", requestData);

      console.log(`Vehicle ${vehicleId} Raw Response:`, JSON.stringify(response, null, 2));

      // MM API returns HTTP 200 even for success
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "getVehicleInfo");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      // Check data structure
      const { data } = response.body;
      expect(data).toHaveProperty("vin");
      expect(data).toHaveProperty("color");
      expect(data.vin).toHaveProperty("type");
      expect(data.vin).toHaveProperty("value");
    });

    test.each(INVALID_VEHICLE_IDS)(
      "should return HTTP 200 with error status in body for invalid ID %s",
      async (vehicleId) => {
        const requestData = {
          id: vehicleId,
          responseType: "JSON",
        };

        const response = await makeRawMMAPIRequest("/v1/getVehicleInfoService", requestData);

        console.log(`Invalid Vehicle ${vehicleId} Raw Response:`, JSON.stringify(response, null, 2));

        // MM API returns HTTP 200 even for errors, but puts error status in body
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "404");
        expect(response.body).not.toHaveProperty("data");
        expect(response.body).toHaveProperty("reason");
        expect(response.body.reason).toContain("not found");
      }
    );
  });

  describe("Raw Security Status API", () => {
    test.each(VALID_VEHICLE_IDS)("should return valid security status for ID %s", async (vehicleId) => {
      const requestData = {
        id: vehicleId,
        responseType: "JSON",
      };

      const response = await makeRawMMAPIRequest("/v1/getSecurityStatusService", requestData);

      console.log(`Security ${vehicleId} Raw Response:`, JSON.stringify(response, null, 2));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "getSecurityStatus");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      const { data } = response.body;
      expect(data).toHaveProperty("doors");
      expect(data.doors).toHaveProperty("type");
      expect(data.doors).toHaveProperty("values");
    });

    test.each(INVALID_VEHICLE_IDS)(
      "should return HTTP 200 with error status in body for invalid ID %s",
      async (vehicleId) => {
        const requestData = {
          id: vehicleId,
          responseType: "JSON",
        };

        const response = await makeRawMMAPIRequest("/v1/getSecurityStatusService", requestData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", "404");
        expect(response.body).toHaveProperty("reason");
      }
    );
  });

  describe("Raw Energy Info API", () => {
    test.each(VALID_VEHICLE_IDS)("should return valid energy info for ID %s", async (vehicleId) => {
      const requestData = {
        id: vehicleId,
        responseType: "JSON",
      };

      const response = await makeRawMMAPIRequest("/v1/getEnergyService", requestData);

      console.log(`Energy ${vehicleId} Raw Response:`, JSON.stringify(response, null, 2));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "getEnergy");
      expect(response.body).toHaveProperty("status", "200");
      expect(response.body).toHaveProperty("data");

      const { data } = response.body;
      expect(data).toHaveProperty("tankLevel");
      expect(data).toHaveProperty("batteryLevel");
    });
  });

  describe("Raw Engine Control API", () => {
    test.each(VALID_VEHICLE_IDS)("should return valid response for engine START on ID %s", async (vehicleId) => {
      const requestData = {
        id: vehicleId,
        command: "START_VEHICLE",
        responseType: "JSON",
      };

      const response = await makeRawMMAPIRequest("/v1/actionEngineService", requestData);

      console.log(`Engine Start ${vehicleId} Raw Response:`, JSON.stringify(response, null, 2));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "actionEngine");
      // Note: Engine control might return different status codes
      expect(response.body).toHaveProperty("status");
    });

    test.each(VALID_VEHICLE_IDS)("should return valid response for engine STOP on ID %s", async (vehicleId) => {
      const requestData = {
        id: vehicleId,
        command: "STOP_VEHICLE",
        responseType: "JSON",
      };

      const response = await makeRawMMAPIRequest("/v1/actionEngineService", requestData);

      console.log(`Engine Stop ${vehicleId} Raw Response:`, JSON.stringify(response, null, 2));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("service", "actionEngine");
      expect(response.body).toHaveProperty("status");
    });
  });
});
