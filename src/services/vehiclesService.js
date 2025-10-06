/**
 * Vehicle Service Layer with Provider Abstraction
 * Orchestrates vehicle operations using pluggable providers
 */
const providerFactory = require("../providers/ProviderFactory");
const { NotFoundError } = require("../utils/errors");
const logger = require("../../logger");

/**
 * Get vehicle details using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - Smartcar formatted vehicle info
 */
const getVehicleDetails = async (vehicleId, correlationId) => {
  logger.info({ correlationId, vehicleId, service: "VehicleService" }, "Getting provider for vehicle details");

  const provider = providerFactory.getProviderForVehicle(vehicleId, correlationId);

  if (!provider) {
    logger.error({ correlationId, vehicleId, service: "VehicleService" }, "No provider available for vehicle");
    throw new NotFoundError(`No provider available for vehicle ${vehicleId}`);
  }

  logger.info(
    { correlationId, vehicleId, provider: provider.name, service: "VehicleService" },
    "Calling provider for vehicle details"
  );
  return await provider.getVehicleInfo(vehicleId, correlationId);
};

/**
 * Get door lock status using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Array>} - Smartcar formatted door status array
 */
const getDoorLockStatus = async (vehicleId, correlationId) => {
  logger.info({ correlationId, vehicleId, service: "VehicleService" }, "Getting provider for door status");

  const provider = providerFactory.getProviderForVehicle(vehicleId, correlationId);

  if (!provider) {
    logger.error({ correlationId, vehicleId, service: "VehicleService" }, "No provider available for vehicle");
    throw new NotFoundError(`No provider available for vehicle ${vehicleId}`);
  }

  logger.info(
    { correlationId, vehicleId, provider: provider.name, service: "VehicleService" },
    "Calling provider for door status"
  );
  return await provider.getDoorStatus(vehicleId, correlationId);
};

/**
 * Get fuel level using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - Smartcar formatted fuel level
 */
const getFuelLevel = async (vehicleId, correlationId) => {
  logger.info({ correlationId, vehicleId, service: "VehicleService" }, "Getting provider for fuel level");

  const provider = providerFactory.getProviderForVehicle(vehicleId, correlationId);

  if (!provider) {
    logger.error({ correlationId, vehicleId, service: "VehicleService" }, "No provider available for vehicle");
    throw new NotFoundError(`No provider available for vehicle ${vehicleId}`);
  }

  logger.info(
    { correlationId, vehicleId, provider: provider.name, service: "VehicleService" },
    "Calling provider for fuel level"
  );
  return await provider.getFuelLevel(vehicleId, correlationId);
};

/**
 * Get battery level using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - Smartcar formatted battery level
 */
const getBatteryLevel = async (vehicleId, correlationId) => {
  logger.info({ correlationId, vehicleId, service: "VehicleService" }, "Getting provider for battery level");

  const provider = providerFactory.getProviderForVehicle(vehicleId, correlationId);

  if (!provider) {
    logger.error({ correlationId, vehicleId, service: "VehicleService" }, "No provider available for vehicle");
    throw new NotFoundError(`No provider available for vehicle ${vehicleId}`);
  }

  logger.info(
    { correlationId, vehicleId, provider: provider.name, service: "VehicleService" },
    "Calling provider for battery level"
  );
  return await provider.getBatteryLevel(vehicleId, correlationId);
};

/**
 * Control vehicle engine using appropriate provider
 * @param {string} vehicleId - The vehicle ID
 * @param {string} action - 'START' or 'STOP'
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - Smartcar formatted action result
 */
const controlVehicleEngine = async (vehicleId, action, correlationId) => {
  logger.info({ correlationId, vehicleId, action, service: "VehicleService" }, "Getting provider for engine control");

  const provider = providerFactory.getProviderForVehicle(vehicleId, correlationId);

  if (!provider) {
    logger.error({ correlationId, vehicleId, action, service: "VehicleService" }, "No provider available for vehicle");
    throw new NotFoundError(`No provider available for vehicle ${vehicleId}`);
  }

  logger.info(
    { correlationId, vehicleId, action, provider: provider.name, service: "VehicleService" },
    "Calling provider for engine control"
  );
  return await provider.controlEngine(vehicleId, action, correlationId);
};

/**
 * Get health status of all providers
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Promise<Object>} - Health status summary
 */
const getProvidersHealth = async (correlationId) => {
  logger.info({ correlationId, service: "VehicleService" }, "Getting health status of all providers");

  const healthChecks = await providerFactory.getProvidersHealth(correlationId);
  const stats = providerFactory.getProviderStats();

  const result = {
    summary: {
      totalProviders: stats.totalProviders,
      healthyProviders: healthChecks.filter((h) => h.status === "healthy").length,
      timestamp: new Date().toISOString(),
    },
    providers: healthChecks,
    stats: stats,
  };

  logger.info(
    {
      correlationId,
      service: "VehicleService",
      totalProviders: result.summary.totalProviders,
      healthyProviders: result.summary.healthyProviders,
    },
    "Provider health check completed"
  );

  return result;
};

/**
 * Get information about available providers
 * @param {string} correlationId - The correlation ID for tracing
 * @returns {Object} - Provider information
 */
const getProviderInfo = (correlationId) => {
  logger.info({ correlationId, service: "VehicleService" }, "Getting provider information");

  const stats = providerFactory.getProviderStats();

  logger.info(
    { correlationId, service: "VehicleService", totalProviders: stats.totalProviders },
    "Provider information retrieved"
  );

  return stats;
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
