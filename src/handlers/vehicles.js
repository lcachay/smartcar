const {
  getVehicleDetails,
  getDoorLockStatus,
  getFuelLevel,
  getBatteryLevel,
  controlVehicleEngine,
} = require("../services/vehiclesService");

/**
 * Get vehicle information by ID
 */
const getVehicleInfoById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicleInfo = await getVehicleDetails(vehicleId);
    res.json(vehicleInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * Get door lock status by vehicle ID
 */
const getDoorStatusById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const doorStatus = await getDoorLockStatus(vehicleId);
    res.json(doorStatus);
  } catch (error) {
    next(error);
  }
};

/**
 * Get fuel level by vehicle ID
 */
const getFuelLevelById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const fuelLevel = await getFuelLevel(vehicleId);
    res.json(fuelLevel);
  } catch (error) {
    next(error);
  }
};

/**
 * Get battery level by vehicle ID
 */
const getBatteryLevelById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const batteryLevel = await getBatteryLevel(vehicleId);
    res.json(batteryLevel);
  } catch (error) {
    next(error);
  }
};

/**
 * Control vehicle engine (start/stop)
 */
const controlEngineById = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const { action } = req.body;

    const result = await controlVehicleEngine(vehicleId, action);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicleInfoById,
  getDoorStatusById,
  getFuelLevelById,
  getBatteryLevelById,
  controlEngineById,
};
