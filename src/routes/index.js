const express = require("express");
const router = express.Router();

// Import route modules
const vehicleRoutes = require("./vehicles");

// Mount vehicle routes
router.use("/vehicles", vehicleRoutes);

module.exports = router;
