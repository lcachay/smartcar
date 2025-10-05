/**
 * Vehicle Provider Factory
 * Manages and creates vehicle provider instances
 * Handles provider selection and routing
 */
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

    console.log(`Initialized ${this.providers.size} vehicle providers`);
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
      console.log(`Registered provider: ${name}`);
    } catch (error) {
      console.error(`Failed to register provider ${name}:`, error.message);
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
   * @returns {BaseVehicleProvider|null} - Matching provider or null
   */
  getProviderForVehicle(vehicleId) {
    for (const provider of this.providers.values()) {
      if (provider.supportsVehicle(vehicleId)) {
        console.log(`Vehicle ${vehicleId} routed to provider: ${provider.name}`);
        return provider;
      }
    }

    console.warn(`No provider found for vehicle: ${vehicleId}`);
    return null;
  }

  /**
   * Get health status of all providers
   * @returns {Promise<Array>} - Array of provider health statuses
   */
  async getProvidersHealth() {
    const healthChecks = [];

    for (const provider of this.providers.values()) {
      try {
        const health = await provider.getHealthStatus();
        healthChecks.push(health);
      } catch (error) {
        healthChecks.push({
          provider: provider.name,
          status: "error",
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

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
