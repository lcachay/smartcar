const express = require("express");
const { getProvidersHealth, getProviderInfo } = require("../services/vehiclesService");
const logger = require("../../logger");
const router = express.Router();

/**
 * @swagger
 * /api/providers/info:
 *   get:
 *     summary: Get provider information
 *     description: Retrieve information about all registered vehicle data providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: Provider information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProviderInfo'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/info", async (req, res) => {
  const { correlationId } = req;

  try {
    logger.info({ correlationId, operation: "getProviderInfo" }, "Getting provider information");

    const providerInfo = getProviderInfo(correlationId);

    logger.info(
      { correlationId, operation: "getProviderInfo", totalProviders: providerInfo.totalProviders },
      "Provider information retrieved successfully"
    );
    res.json(providerInfo);
  } catch (error) {
    logger.error({ correlationId, operation: "getProviderInfo", error: error.message }, "Error getting provider info");
    res.status(500).json({ error: "Failed to get provider information" });
  }
});

/**
 * @swagger
 * /api/providers/health:
 *   get:
 *     summary: Get provider health status
 *     description: Check the health status of all registered vehicle data providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: All providers are healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProviderHealth'
 *       503:
 *         description: One or more providers are unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProviderHealth'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/health", async (req, res) => {
  const { correlationId } = req;

  try {
    logger.info({ correlationId, operation: "getProvidersHealth" }, "Starting provider health check");

    const health = await getProvidersHealth(correlationId);

    // Set appropriate HTTP status based on overall health
    const allHealthy = health.providers.every((p) => p.status === "healthy");
    const statusCode = allHealthy ? 200 : 503; // Service Unavailable if any provider is unhealthy

    logger.info(
      {
        correlationId,
        operation: "getProvidersHealth",
        totalProviders: health.summary.totalProviders,
        healthyProviders: health.summary.healthyProviders,
        allHealthy,
        statusCode,
      },
      "Provider health check completed"
    );

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error(
      { correlationId, operation: "getProvidersHealth", error: error.message },
      "Error getting provider health"
    );
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
