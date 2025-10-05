/**
 * Vehicle Service Layer with Provider Abstraction
 * Orchestrates vehicle operations using pluggable providers
 */
const providerFactory = require("../providers/ProviderFactory");

/**
 * Get vehicle details using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - Smartcar formatted vehicle info
 */
const getVehicleDetails = async (vehicleId) => {
  const provider = providerFactory.getProviderForVehicle(vehicleId);

  if (!provider) {
    const error = new Error(`No provider available for vehicle ${vehicleId}`);
    error.status = 404;
    throw error;
  }

  return await provider.getVehicleInfo(vehicleId);
};

/**
 * Get door lock status using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Array>} - Smartcar formatted door status array
 */
const getDoorLockStatus = async (vehicleId) => {
  const provider = providerFactory.getProviderForVehicle(vehicleId);

  if (!provider) {
    const error = new Error(`No provider available for vehicle ${vehicleId}`);
    error.status = 404;
    throw error;
  }

  return await provider.getDoorStatus(vehicleId);
};

/**
 * Get fuel level using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - Smartcar formatted fuel level
 */
const getFuelLevel = async (vehicleId) => {
  const provider = providerFactory.getProviderForVehicle(vehicleId);

  if (!provider) {
    const error = new Error(`No provider available for vehicle ${vehicleId}`);
    error.status = 404;
    throw error;
  }

  return await provider.getFuelLevel(vehicleId);
};

/**
 * Get battery level using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - Smartcar formatted battery level
 */
const getBatteryLevel = async (vehicleId) => {
  const provider = providerFactory.getProviderForVehicle(vehicleId);

  if (!provider) {
    const error = new Error(`No provider available for vehicle ${vehicleId}`);
    error.status = 404;
    throw error;
  }

  return await provider.getBatteryLevel(vehicleId);
};

/**
 * Control vehicle engine using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @param {string} action - 'START' or 'STOP'
 * @returns {Promise<Object>} - Smartcar formatted action result
 */
const controlVehicleEngine = async (vehicleId, action) => {
  const provider = providerFactory.getProviderForVehicle(vehicleId);

  if (!provider) {
    const error = new Error(`No provider available for vehicle ${vehicleId}`);
    error.status = 404;
    throw error;
  }

  return await provider.controlEngine(vehicleId, action);
};

/**
 * Get health status of all providers
 * @returns {Promise<Object>} - Health status summary
 */
const getProvidersHealth = async () => {
  const healthChecks = await providerFactory.getProvidersHealth();
  const stats = providerFactory.getProviderStats();

  return {
    summary: {
      totalProviders: stats.totalProviders,
      healthyProviders: healthChecks.filter((h) => h.status === "healthy").length,
      timestamp: new Date().toISOString(),
    },
    providers: healthChecks,
    stats: stats,
  };
};

/**
 * Get information about available providers
 * @returns {Object} - Provider information
 */
const getProviderInfo = () => {
  return providerFactory.getProviderStats();
};

module.exports = {
  getVehicleDetails,
  getDoorLockStatus,
  getFuelLevel,
  getBatteryLevel,
  controlVehicleEngine,
  getProvidersHealth,
  getProviderInfo,
};
