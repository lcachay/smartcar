const { getVehicleInfo, getSecurityStatus, getEnergyInfo, controlEngine } = require("./mmApi");

const {
  mapVehicleInfo,
  mapDoorStatus,
  mapFuelLevel,
  mapBatteryLevel,
  mapEngineAction,
  convertEngineAction,
} = require("../utils/mappers");

/**
 * Get vehicle information
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - Smartcar formatted vehicle info
 */
const getVehicleDetails = async (vehicleId) => {
  const mmResponse = await getVehicleInfo(vehicleId);

  // Handle MM API errors
  if (mmResponse.statusCode !== 200) {
    const error = new Error(mmResponse.body || "Vehicle not found");
    error.status = parseInt(mmResponse.statusCode);
    throw error;
  }

  return mapVehicleInfo(mmResponse);
};

/**
 * Get door lock status
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Array>} - Smartcar formatted door status array
 */
const getDoorLockStatus = async (vehicleId) => {
  const mmResponse = await getSecurityStatus(vehicleId);

  // Handle MM API errors
  if (mmResponse.statusCode !== 200) {
    const error = new Error(mmResponse.body || "Vehicle not found");
    error.status = parseInt(mmResponse.statusCode);
    throw error;
  }

  return mapDoorStatus(mmResponse);
};

/**
 * Get fuel level
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - Smartcar formatted fuel level
 */
const getFuelLevel = async (vehicleId) => {
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
};

/**
 * Get battery level
 * @param {string} vehicleId - The vehicle ID
 * @returns {Promise<Object>} - Smartcar formatted battery level
 */
const getBatteryLevel = async (vehicleId) => {
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
};

/**
 * Control engine (start/stop)
 * @param {string} vehicleId - The vehicle ID
 * @param {string} action - 'START' or 'STOP'
 * @returns {Promise<Object>} - Smartcar formatted action result
 */
const controlVehicleEngine = async (vehicleId, action) => {
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
};

module.exports = {
  getVehicleDetails,
  getDoorLockStatus,
  getFuelLevel,
  getBatteryLevel,
  controlVehicleEngine,
};
