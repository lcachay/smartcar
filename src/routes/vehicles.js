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

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get vehicle information
 *     description: Retrieve basic information about a vehicle including VIN, color, door count, and drive train
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Vehicle information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleInfo'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateVehicleId, getVehicleInfoById);

/**
 * @swagger
 * /api/vehicles/{id}/doors:
 *   get:
 *     summary: Get door lock status
 *     description: Retrieve the lock status of all vehicle doors
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Door status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoorStatus'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/doors", validateVehicleId, getDoorStatusById);

/**
 * @swagger
 * /api/vehicles/{id}/fuel:
 *   get:
 *     summary: Get fuel level
 *     description: Retrieve the current fuel level percentage of the vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Fuel level retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnergyLevel'
 *       404:
 *         description: Vehicle not found or does not have fuel data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/fuel", validateVehicleId, getFuelLevelById);

/**
 * @swagger
 * /api/vehicles/{id}/battery:
 *   get:
 *     summary: Get battery level
 *     description: Retrieve the current battery level percentage of the vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *           example: "1234"
 *     responses:
 *       200:
 *         description: Battery level retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnergyLevel'
 *       404:
 *         description: Vehicle not found or does not have battery data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/battery", validateVehicleId, getBatteryLevelById);

/**
 * @swagger
 * /api/vehicles/{id}/engine:
 *   post:
 *     summary: Control engine (start/stop)
 *     description: Start or stop the vehicle engine
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *           example: "1234"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EngineAction'
 *     responses:
 *       200:
 *         description: Engine action completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EngineActionResult'
 *       400:
 *         description: Invalid action provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/engine", validateVehicleId, validateEngineAction, controlEngineById);

module.exports = router;
