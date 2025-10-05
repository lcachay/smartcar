const express = require("express");
const { getProvidersHealth, getProviderInfo } = require("../services/vehiclesService");
const logger = require("../../logger");
const router = express.Router();

// GET /providers/info - Get provider information
router.get("/info", async (req, res) => {
  try {
    const providerInfo = getProviderInfo();
    res.json(providerInfo);
  } catch (error) {
    logger.error(error, "Error getting provider info");
    res.status(500).json({ error: "Failed to get provider information" });
  }
});

// GET /providers/health - Get health status of all providers
router.get("/health", async (req, res) => {
  try {
    const health = await getProvidersHealth();

    // Set appropriate HTTP status based on overall health
    const allHealthy = health.providers.every((p) => p.status === "healthy");
    const statusCode = allHealthy ? 200 : 503; // Service Unavailable if any provider is unhealthy

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error(error, "Error getting provider health");
    res.status(500).json({
      error: "Failed to get provider health",
      summary: {
        totalProviders: 0,
        healthyProviders: 0,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;
