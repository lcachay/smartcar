const express = require("express");
const {
  getVehicleInfoById,
  getDoorStatusById,
  getFuelLevelById,
  getBatteryLevelById,
  controlEngineById,
} = require("../handlers/vehicles");
const router = express.Router();

// GET /vehicles/:id - Vehicle information
router.get("/:id", getVehicleInfoById);

// GET /vehicles/:id/doors - Door lock status
router.get("/:id/doors", getDoorStatusById);

// GET /vehicles/:id/fuel - Fuel level
router.get("/:id/fuel", getFuelLevelById);

// GET /vehicles/:id/battery - Battery level
router.get("/:id/battery", getBatteryLevelById);

// POST /vehicles/:id/engine - Start/stop engine
router.post("/:id/engine", controlEngineById);

module.exports = router;
