/**
 * Vehicle Provider Factory
 * Manages and creates vehicle provider instances
 * Handles provider selection and routing
 */
const logger = require("../../logger");
const MMApiProvider = require("./MMApiProvider");

class ProviderFactory {
  constructor() {
    this.providers = new Map();
    this.config = {};
    this.initializeProviders();
  }

  /**
   * Initialize all available providers
   */
  initializeProviders() {
    // Initialize MM API Provider
    const mmApiConfig = {
      supportedVehicleIds: ["1234", "1235"],
    };
    this.registerProvider("MM_API", MMApiProvider, mmApiConfig);

    logger.info(`Initialized ${this.providers.size} vehicle providers`);
  }

  /**
   * Register a new provider
   * @param {string} name - Provider name
   * @param {Class} ProviderClass - Provider class
   * @param {Object} config - Provider configuration
   */
  registerProvider(name, ProviderClass, config = {}) {
    try {
      const provider = new ProviderClass(config);
      this.providers.set(name, provider);
      logger.info(`Registered provider: ${name}`);
    } catch (error) {
      logger.error(error.message, `Failed to register provider ${name}:`);
    }
  }

  /**
   * Get all registered providers
   * @returns {Array} - Array of provider instances
   */
  getAllProviders() {
    return Array.from(this.providers.values());
  }

  /**
   * Get a specific provider by name
   * @param {string} name - Provider name
   * @returns {BaseVehicleProvider|null} - Provider instance or null
   */
  getProvider(name) {
    return this.providers.get(name) || null;
  }

  /**
   * Find the appropriate provider for a vehicle ID
   * @param {string} vehicleId - The vehicle ID
   * @param {string} correlationId - The correlation ID for tracing
   * @returns {BaseVehicleProvider|null} - Matching provider or null
   */
  getProviderForVehicle(vehicleId, correlationId) {
    for (const provider of this.providers.values()) {
      if (provider.supportsVehicle(vehicleId)) {
        logger.info(
          {
            correlationId,
            vehicleId,
            provider: provider.name,
            service: "ProviderFactory",
          },
          `Vehicle ${vehicleId} routed to provider: ${provider.name}`
        );
        return provider;
      }
    }

    logger.warn(
      {
        correlationId,
        vehicleId,
        service: "ProviderFactory",
      },
      `No provider found for vehicle: ${vehicleId}`
    );
    return null;
  }

  /**
   * Get health status of all providers
   * @param {string} correlationId - The correlation ID for tracing
   * @returns {Promise<Array>} - Array of provider health statuses
   */
  async getProvidersHealth(correlationId) {
    logger.info({ correlationId, service: "ProviderFactory" }, "Starting health check for all providers");

    const healthChecks = [];

    for (const provider of this.providers.values()) {
      try {
        logger.info(
          { correlationId, provider: provider.name, service: "ProviderFactory" },
          `Checking health of provider: ${provider.name}`
        );

        const health = await provider.getHealthStatus(correlationId);
        healthChecks.push(health);

        logger.info(
          {
            correlationId,
            provider: provider.name,
            status: health.status,
            service: "ProviderFactory",
          },
          `Health check completed for provider: ${provider.name}`
        );
      } catch (error) {
        logger.error(
          {
            correlationId,
            provider: provider.name,
            error: error.message,
            service: "ProviderFactory",
          },
          `Health check failed for provider: ${provider.name}`
        );

        healthChecks.push({
          provider: provider.name,
          status: "error",
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    logger.info(
      {
        correlationId,
        totalProviders: healthChecks.length,
        healthyProviders: healthChecks.filter((h) => h.status === "healthy").length,
        service: "ProviderFactory",
      },
      "Completed health check for all providers"
    );

    return healthChecks;
  }

  /**
   * Get provider statistics
   * @returns {Object} - Provider statistics
   */
  getProviderStats() {
    const stats = {
      totalProviders: this.providers.size,
      providers: {},
    };

    for (const [name, provider] of this.providers) {
      stats.providers[name] = {
        name: provider.name,
        type: provider.constructor.name,
      };
    }

    return stats;
  }

  /**
   * Test all providers with their supported vehicles
   * @returns {Promise<Object>} - Test results for all providers
   */
  async testAllProviders() {
    const results = {};

    for (const [name, provider] of this.providers) {
      results[name] = {
        provider: name,
        tests: [],
      };

      try {
        // Test health check
        const health = await provider.getHealthStatus();
        results[name].tests.push({
          test: "health_check",
          status: health.status === "healthy" ? "passed" : "failed",
          details: health,
        });
      } catch (error) {
        results[name].tests.push({
          test: "health_check",
          status: "failed",
          error: error.message,
        });
      }
    }

    return results;
  }
}

// Create singleton instance
const providerFactory = new ProviderFactory();

module.exports = providerFactory;
