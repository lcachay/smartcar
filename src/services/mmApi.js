const axios = require("axios");
const logger = require("../../logger");

const MM_API_BASE_URL = "https://platform-challenge.smartcar.com";

/**
 * Make a request to the MM API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The request body data
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - The parsed JSON response
 */
const makeMMAPIRequest = async (endpoint, data, correlationId) => {
  const startTime = Date.now();

  try {
    logger.info(
      {
        correlationId,
        endpoint,
        vehicleId: data?.id,
        externalAPI: "MM_API",
        url: `${MM_API_BASE_URL}${endpoint}`,
        requestData: data,
      },
      `Making MM API request to: ${MM_API_BASE_URL}${endpoint}`
    );

    const response = await axios.post(`${MM_API_BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId, // Pass correlation ID to external API
      },
      timeout: 10000,
    });

    const responseTime = Date.now() - startTime;

    logger.info(
      {
        correlationId,
        endpoint,
        vehicleId: data?.id,
        externalAPI: "MM_API",
        statusCode: response.status,
        responseTime: `${responseTime}ms`,
        mmApiStatus: response.data?.status,
      },
      `MM API Response Status: ${response.status} (${responseTime}ms)`
    );

    // MM API returns its own error status inside the body
    if (parseInt(response.data.status) < 200 || parseInt(response.data.status) >= 300) {
      logger.error(
        {
          correlationId,
          endpoint,
          vehicleId: data?.id,
          externalAPI: "MM_API",
          mmApiStatus: parseInt(response.data.status),
          mmApiReason: response.data.reason,
          responseTime: `${responseTime}ms`,
        },
        "MM API returned error status in response body"
      );

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
    const responseTime = Date.now() - startTime;

    if (error.response) {
      logger.error(
        {
          correlationId,
          endpoint,
          vehicleId: data?.id,
          externalAPI: "MM_API",
          statusCode: error.response.status,
          errorData: error.response.data,
          responseTime: `${responseTime}ms`,
        },
        `MM API Error Response Status: ${error.response.status}`
      );

      return {
        statusCode: error.response.status,
        headers: error.response.headers,
        body: error.response.data,
      };
    } else {
      logger.error(
        {
          correlationId,
          endpoint,
          vehicleId: data?.id,
          externalAPI: "MM_API",
          error: error.message,
          responseTime: `${responseTime}ms`,
        },
        `MM API Error: ${error.message}`
      );

      throw error;
    }
  }
};

/**
 * Get vehicle information from MM API
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - The vehicle info response
 */
const getVehicleInfo = async (vehicleId, correlationId) => {
  const requestData = {
    id: vehicleId,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/getVehicleInfoService", requestData, correlationId);
};

/**
 * Get security status (door locks) from MM API
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - The security status response
 */
const getSecurityStatus = async (vehicleId, correlationId) => {
  const requestData = {
    id: vehicleId,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/getSecurityStatusService", requestData, correlationId);
};

/**
 * Get energy (fuel/battery) information from MM API
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - The energy info response
 */
const getEnergyInfo = async (vehicleId, correlationId) => {
  const requestData = {
    id: vehicleId,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/getEnergyService", requestData, correlationId);
};

/**
 * Control engine (start/stop) via MM API
 * @param {string} vehicleId - The vehicle ID
 * @param {string} command - 'START_VEHICLE' or 'STOP_VEHICLE'
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - The action result response
 */
const controlEngine = async (vehicleId, command, correlationId) => {
  const requestData = {
    id: vehicleId,
    command: command,
    responseType: "JSON",
  };

  return await makeMMAPIRequest("/v1/actionEngineService", requestData, correlationId);
};

module.exports = {
  getVehicleInfo,
  getSecurityStatus,
  getEnergyInfo,
  controlEngine,
  makeMMAPIRequest,
};
