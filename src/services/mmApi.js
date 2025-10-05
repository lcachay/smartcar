const axios = require("axios");
const logger = require("../../logger");

const MM_API_BASE_URL = "https://platform-challenge.smartcar.com";

/**
 * Make a request to the MM API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The request body data
 * @returns {Promise<Object>} - The parsed JSON response
 */
const makeMMAPIRequest = async (endpoint, data) => {
  try {
    logger.info(`Making MM API request to: ${MM_API_BASE_URL}${endpoint}`);
    logger.info(`Request data: ${JSON.stringify(data)}`);

    const response = await axios.post(`${MM_API_BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    logger.info(`MM API Response Status: ${response.status}`);
    logger.info(`MM API Response Headers: ${JSON.stringify(response.headers)}`);
    logger.info(`MM API Response Body: ${JSON.stringify(response.data)}`);

    // MM API returns its own error status inside the body
    if (parseInt(response.data.status) < 200 || parseInt(response.data.status) >= 300) {
      throw Object.assign(new Error("MM API request failed"), {
        response: {
          status: parseInt(response.data.status),
          data: response.data.reason,
          headers: response.headers,
        },
      });
    }

    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.data,
    };
  } catch (error) {
    if (error.response) {
      logger.error(`MM API Error Response Status: ${error.response.status}`);
      logger.error(`MM API Error Response Headers: ${JSON.stringify(error.response.headers)}`);
      logger.error(`MM API Error Response Body: ${JSON.stringify(error.response.data)}`);

      return {
        statusCode: error.response.status,
        headers: error.response.headers,
        body: error.response.data,
      };
    } else {
      logger.error(`MM API Error: ${error.message}`);
    }
  }
};

/**
 * Get vehicle information from MM API
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - The vehicle info response
 */
const getVehicleInfo = async (vehicleId) => {
  const requestData = {
    id: vehicleId,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/getVehicleInfoService", requestData);
};

/**
 * Get security status (door locks) from MM API
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - The security status response
 */
const getSecurityStatus = async (vehicleId) => {
  const requestData = {
    id: vehicleId,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/getSecurityStatusService", requestData);
};

/**
 * Get energy (fuel/battery) information from MM API
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - The energy info response
 */
const getEnergyInfo = async (vehicleId) => {
  const requestData = {
    id: vehicleId,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/getEnergyService", requestData);
};

/**
 * Control engine (start/stop) via MM API
 * @param {string} vehicleId - The vehicle ID
 * @param {string} command - 'START_VEHICLE' or 'STOP_VEHICLE'
 * @returns {Promise<Object>} - The action result response
 */
const controlEngine = async (vehicleId, command) => {
  const requestData = {
    id: vehicleId,
    command: command,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/actionEngineService", requestData);
};

module.exports = {
  getVehicleInfo,
  getSecurityStatus,
  getEnergyInfo,
  controlEngine,
  makeMMAPIRequest,
};
