const {
  getVehicleDetails,
  getDoorLockStatus,
  getFuelLevel,
  getBatteryLevel,
  controlVehicleEngine,
} = require("../services/vehiclesService");
const logger = require("../../logger");

/**
 * Get vehicle information by ID
 */
const getVehicleInfoById = async (req, res, next) => {
  const { correlationId } = req;
  const vehicleId = req.params.id;

  try {
    logger.info({ correlationId, vehicleId, operation: "getVehicleInfo" }, "Starting vehicle info retrieval");

    const vehicleInfo = await getVehicleDetails(vehicleId, correlationId);

    logger.info({ correlationId, vehicleId, operation: "getVehicleInfo" }, "Vehicle info retrieved successfully");
    res.json(vehicleInfo);
  } catch (error) {
    logger.error(
      { correlationId, vehicleId, operation: "getVehicleInfo", error: error.message },
      "Failed to retrieve vehicle info"
    );
    next(error);
  }
};

/**
 * Get door lock status by vehicle ID
 */
const getDoorStatusById = async (req, res, next) => {
  const { correlationId } = req;
  const vehicleId = req.params.id;

  try {
    logger.info({ correlationId, vehicleId, operation: "getDoorStatus" }, "Starting door status retrieval");

    const doorStatus = await getDoorLockStatus(vehicleId, correlationId);

    logger.info({ correlationId, vehicleId, operation: "getDoorStatus" }, "Door status retrieved successfully");
    res.json(doorStatus);
  } catch (error) {
    logger.error(
      { correlationId, vehicleId, operation: "getDoorStatus", error: error.message },
      "Failed to retrieve door status"
    );
    next(error);
  }
};

/**
 * Get fuel level by vehicle ID
 */
const getFuelLevelById = async (req, res, next) => {
  const { correlationId } = req;
  const vehicleId = req.params.id;

  try {
    logger.info({ correlationId, vehicleId, operation: "getFuelLevel" }, "Starting fuel level retrieval");

    const fuelLevel = await getFuelLevel(vehicleId, correlationId);

    logger.info({ correlationId, vehicleId, operation: "getFuelLevel" }, "Fuel level retrieved successfully");
    res.json(fuelLevel);
  } catch (error) {
    logger.error(
      { correlationId, vehicleId, operation: "getFuelLevel", error: error.message },
      "Failed to retrieve fuel level"
    );
    next(error);
  }
};

/**
 * Get battery level by vehicle ID
 */
const getBatteryLevelById = async (req, res, next) => {
  const { correlationId } = req;
  const vehicleId = req.params.id;

  try {
    logger.info({ correlationId, vehicleId, operation: "getBatteryLevel" }, "Starting battery level retrieval");

    const batteryLevel = await getBatteryLevel(vehicleId, correlationId);

    logger.info({ correlationId, vehicleId, operation: "getBatteryLevel" }, "Battery level retrieved successfully");
    res.json(batteryLevel);
  } catch (error) {
    logger.error(
      { correlationId, vehicleId, operation: "getBatteryLevel", error: error.message },
      "Failed to retrieve battery level"
    );
    next(error);
  }
};

/**
 * Control vehicle engine (start/stop)
 */
const controlEngineById = async (req, res, next) => {
  const { correlationId } = req;
  const vehicleId = req.params.id;
  const { action } = req.body;

  try {
    logger.info({ correlationId, vehicleId, action, operation: "controlEngine" }, "Starting engine control operation");

    const result = await controlVehicleEngine(vehicleId, action, correlationId);

    logger.info(
      { correlationId, vehicleId, action, operation: "controlEngine" },
      "Engine control operation completed successfully"
    );
    res.json(result);
  } catch (error) {
    logger.error(
      { correlationId, vehicleId, action, operation: "controlEngine", error: error.message },
      "Failed to control vehicle engine"
    );
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
