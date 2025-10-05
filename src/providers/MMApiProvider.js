/**
 * MM API Provider Implementation
 * Implements the BaseVehicleProvider interface for the MM API
 */
const BaseVehicleProvider = require("./BaseVehicleProvider");
const { getVehicleInfo, getSecurityStatus, getEnergyInfo, controlEngine } = require("../services/mmApi");
const {
  mapVehicleInfo,
  mapDoorStatus,
  mapFuelLevel,
  mapBatteryLevel,
  mapEngineAction,
  convertEngineAction,
} = require("../utils/mappers");

class MMApiProvider extends BaseVehicleProvider {
  constructor(config = {}) {
    super("MM_API", config);
    this.supportedVehicleIds = config.supportedVehicleIds || ["1234", "1235"];
  }

  /**
   * Check if this provider supports a given vehicle ID
   * @param {string} vehicleId - The vehicle ID
   * @returns {boolean} - Whether this provider supports the vehicle
   */
  supportsVehicle(vehicleId) {
    // MM API supports specific vehicle IDs
    return this.supportedVehicleIds.includes(vehicleId);
  }

  /**
   * Get vehicle information
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Object>} - Standardized vehicle info
   */
  async getVehicleInfo(vehicleId) {
    if (!this.supportsVehicle(vehicleId)) {
      const error = new Error(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
      error.status = 404;
      throw error;
    }

    const mmResponse = await getVehicleInfo(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      const error = new Error(mmResponse.body || "Vehicle not found");
      error.status = parseInt(mmResponse.statusCode);
      throw error;
    }

    return mapVehicleInfo(mmResponse);
  }

  /**
   * Get door lock status
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Array>} - Standardized door status array
   */
  async getDoorStatus(vehicleId) {
    if (!this.supportsVehicle(vehicleId)) {
      const error = new Error(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
      error.status = 404;
      throw error;
    }

    const mmResponse = await getSecurityStatus(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      const error = new Error(mmResponse.body || "Vehicle not found");
      error.status = parseInt(mmResponse.statusCode);
      throw error;
    }

    return mapDoorStatus(mmResponse);
  }

  /**
   * Get fuel level
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Object>} - Standardized fuel level
   */
  async getFuelLevel(vehicleId) {
    if (!this.supportsVehicle(vehicleId)) {
      const error = new Error(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
      error.status = 404;
      throw error;
    }

    const mmResponse = await getEnergyInfo(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      const error = new Error(mmResponse.body || "Vehicle not found");
      error.status = parseInt(mmResponse.statusCode);
      throw error;
    }

    // Check if vehicle has fuel data
    if (mmResponse.body.data.tankLevel.type === "Null" || mmResponse.body.data.tankLevel.value === "null") {
      const error = new Error("Vehicle does not have fuel data");
      error.status = 404;
      throw error;
    }

    return mapFuelLevel(mmResponse);
  }

  /**
   * Get battery level
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Object>} - Standardized battery level
   */
  async getBatteryLevel(vehicleId) {
    if (!this.supportsVehicle(vehicleId)) {
      const error = new Error(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
      error.status = 404;
      throw error;
    }

    const mmResponse = await getEnergyInfo(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      const error = new Error(mmResponse.body || "Vehicle not found");
      error.status = parseInt(mmResponse.statusCode);
      throw error;
    }

    // Check if vehicle has battery data
    if (mmResponse.body.data.batteryLevel.type === "Null" || mmResponse.body.data.batteryLevel.value === "null") {
      const error = new Error("Vehicle does not have battery data");
      error.status = 404;
      throw error;
    }

    return mapBatteryLevel(mmResponse);
  }

  /**
   * Control engine (start/stop)
   * @param {string} vehicleId - The vehicle ID
   * @param {string} action - 'START' or 'STOP'
   * @returns {Promise<Object>} - Standardized action result
   */
  async controlEngine(vehicleId, action) {
    if (!this.supportsVehicle(vehicleId)) {
      const error = new Error(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
      error.status = 404;
      throw error;
    }

    // Validate action
    if (!action || !["START", "STOP"].includes(action.toUpperCase())) {
      const error = new Error("Invalid action. Must be START or STOP");
      error.status = 400;
      throw error;
    }

    // Convert to MM API format
    const mmCommand = convertEngineAction(action);

    const mmResponse = await controlEngine(vehicleId, mmCommand);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      const error = new Error(mmResponse.body || "Engine control failed");
      error.status = parseInt(mmResponse.statusCode);
      throw error;
    }

    return mapEngineAction(mmResponse);
  }

  /**
   * Get MM API provider health status
   * @returns {Promise<Object>} - Provider health information
   */
  async getHealthStatus() {
    try {
      // Test with a known vehicle ID
      const testVehicleId = this.supportedVehicleIds[0];
      const startTime = Date.now();

      await getVehicleInfo(testVehicleId);

      const responseTime = Date.now() - startTime;

      return {
        provider: this.name,
        status: "healthy",
        responseTimeMs: responseTime,
        supportedVehicles: this.supportedVehicleIds.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        provider: this.name,
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

module.exports = MMApiProvider;
