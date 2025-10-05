/**
 * MM API Provider Implementation
 * Implements the BaseVehicleProvider interface for the MM API
 */
const BaseVehicleProvider = require("./BaseVehicleProvider");
const { getVehicleInfo, getSecurityStatus, getEnergyInfo, controlEngine } = require("../services/mmApi");
const { NotFoundError, ExternalServiceError, ValidationError } = require("../utils/errors");
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
      throw new NotFoundError(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
    }

    const mmResponse = await getVehicleInfo(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      if (mmResponse.statusCode === 404) {
        throw new NotFoundError(mmResponse.body || "Vehicle not found");
      }
      throw new ExternalServiceError(mmResponse.body || "MM API error", "MM_API");
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
      throw new NotFoundError(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
    }

    const mmResponse = await getSecurityStatus(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      if (mmResponse.statusCode === 404) {
        throw new NotFoundError(mmResponse.body || "Vehicle not found");
      }
      throw new ExternalServiceError(mmResponse.body || "MM API error", "MM_API");
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
      throw new NotFoundError(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
    }

    const mmResponse = await getEnergyInfo(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      if (mmResponse.statusCode === 404) {
        throw new NotFoundError(mmResponse.body || "Vehicle not found");
      }
      throw new ExternalServiceError(mmResponse.body || "MM API error", "MM_API");
    }

    // Check if vehicle has fuel data
    if (mmResponse.body.data.tankLevel.type === "Null" || mmResponse.body.data.tankLevel.value === "null") {
      throw new NotFoundError("Vehicle does not have fuel data");
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
      throw new NotFoundError(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
    }

    const mmResponse = await getEnergyInfo(vehicleId);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      if (mmResponse.statusCode === 404) {
        throw new NotFoundError(mmResponse.body || "Vehicle not found");
      }
      throw new ExternalServiceError(mmResponse.body || "MM API error", "MM_API");
    }

    // Check if vehicle has battery data
    if (mmResponse.body.data.batteryLevel.type === "Null" || mmResponse.body.data.batteryLevel.value === "null") {
      throw new NotFoundError("Vehicle does not have battery data");
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
      throw new NotFoundError(`Vehicle ${vehicleId} not supported by ${this.name} provider`);
    }

    // Validate action
    if (!action || !["START", "STOP"].includes(action.toUpperCase())) {
      throw new ValidationError("Invalid action. Must be START or STOP");
    }

    // Convert to MM API format
    const mmCommand = convertEngineAction(action);

    const mmResponse = await controlEngine(vehicleId, mmCommand);

    // Handle MM API errors
    if (mmResponse.statusCode !== 200) {
      if (mmResponse.statusCode === 404) {
        throw new NotFoundError(mmResponse.body || "Vehicle not found");
      }
      throw new ExternalServiceError(mmResponse.body || "Engine control failed", "MM_API");
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
