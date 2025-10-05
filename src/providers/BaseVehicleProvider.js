/**
 * Abstract base class for vehicle API providers
 * This defines the interface that all providers must implement
 */
class BaseVehicleProvider {
  constructor(name, config = {}) {
    if (this.constructor === BaseVehicleProvider) {
      throw new Error("BaseVehicleProvider is abstract and cannot be instantiated directly");
    }
    this.name = name;
    this.config = config;
  }

  /**
   * Get vehicle information
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Object>} - Standardized vehicle info
   */
  async getVehicleInfo(vehicleId) {
    throw new Error("getVehicleInfo must be implemented by provider");
  }

  /**
   * Get door lock status
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Array>} - Standardized door status array
   */
  async getDoorStatus(vehicleId) {
    throw new Error("getDoorStatus must be implemented by provider");
  }

  /**
   * Get fuel level
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Object>} - Standardized fuel level
   */
  async getFuelLevel(vehicleId) {
    throw new Error("getFuelLevel must be implemented by provider");
  }

  /**
   * Get battery level
   * @param {string} vehicleId - The vehicle ID
   * @returns {Promise<Object>} - Standardized battery level
   */
  async getBatteryLevel(vehicleId) {
    throw new Error("getBatteryLevel must be implemented by provider");
  }

  /**
   * Control engine (start/stop)
   * @param {string} vehicleId - The vehicle ID
   * @param {string} action - 'START' or 'STOP'
   * @returns {Promise<Object>} - Standardized action result
   */
  async controlEngine(vehicleId, action) {
    throw new Error("controlEngine must be implemented by provider");
  }

  /**
   * Check if this provider supports a given vehicle ID
   * @param {string} vehicleId - The vehicle ID
   * @returns {boolean} - Whether this provider supports the vehicle
   */
  supportsVehicle(vehicleId) {
    throw new Error("supportsVehicle must be implemented by provider");
  }

  /**
   * Get provider-specific health status
   * @returns {Promise<Object>} - Provider health information
   */
  async getHealthStatus() {
    return {
      provider: this.name,
      status: "unknown",
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = BaseVehicleProvider;
