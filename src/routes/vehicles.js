const express = require("express");
const {
  getVehicleInfoById,
  getDoorStatusById,
  getFuelLevelById,
  getBatteryLevelById,
  controlEngineById,
} = require("../handlers/vehicles");
const { validateVehicleId, validateEngineAction } = require("../middleware");
const router = express.Router();

// GET /vehicles/:id - Vehicle information
router.get("/:id", validateVehicleId, getVehicleInfoById);

// GET /vehicles/:id/doors - Door lock status
router.get("/:id/doors", validateVehicleId, getDoorStatusById);

// GET /vehicles/:id/fuel - Fuel level
router.get("/:id/fuel", validateVehicleId, getFuelLevelById);

// GET /vehicles/:id/battery - Battery level
router.get("/:id/battery", validateVehicleId, getBatteryLevelById);

// POST /vehicles/:id/engine - Start/stop engine
router.post("/:id/engine", validateVehicleId, validateEngineAction, controlEngineById);

module.exports = router;
