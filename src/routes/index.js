const express = require("express");
const router = express.Router();

// Import route modules
const vehicleRoutes = require("./vehicles");
const providerRoutes = require("./providers");

// Mount vehicle routes
router.use("/vehicles", vehicleRoutes);

// Mount provider routes
router.use("/providers", providerRoutes);

module.exports = router;
