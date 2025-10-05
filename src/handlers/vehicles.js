const {
  getVehicleDetails,
  getDoorLockStatus,
  getFuelLevel,
  getBatteryLevel,
  controlVehicleEngine,
} = require("../services/vehiclesService");

const getVehicleInfoById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const vehicleInfo = await getVehicleDetails(vehicleId);
    res.json(vehicleInfo);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? "Internal server error" : error.message;
    res.status(status).json({ error: message });
  }
};

const getDoorStatusById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const doorStatus = await getDoorLockStatus(vehicleId);
    res.json(doorStatus);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? "Internal server error" : error.message;
    res.status(status).json({ error: message });
  }
};

const getFuelLevelById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const fuelLevel = await getFuelLevel(vehicleId);
    res.json(fuelLevel);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? "Internal server error" : error.message;
    res.status(status).json({ error: message });
  }
};

const getBatteryLevelById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const batteryLevel = await getBatteryLevel(vehicleId);
    res.json(batteryLevel);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? "Internal server error" : error.message;
    res.status(status).json({ error: message });
  }
};

const controlEngineById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const { action } = req.body;

    const result = await controlVehicleEngine(vehicleId, action);
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? "Internal server error" : error.message;
    res.status(status).json({ error: message });
  }
};

module.exports = {
  getVehicleInfoById,
  getDoorStatusById,
  getFuelLevelById,
  getBatteryLevelById,
  controlEngineById,
};
