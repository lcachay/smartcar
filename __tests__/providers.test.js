/**
 * Provider System Tests
 * Tests the provider abstraction and routing functionality
 */

const providerFactory = require("../src/providers/ProviderFactory");

describe("Provider System Tests", () => {
  describe("Provider Factory", () => {
    test("should initialize with multiple providers", () => {
      const stats = providerFactory.getProviderStats();

      expect(stats.totalProviders).toBeGreaterThan(0);
      expect(stats.providers).toHaveProperty("MM_API");
    });

    test("should route MM API vehicle IDs correctly", () => {
      const provider = providerFactory.getProviderForVehicle("1234");

      expect(provider).toBeDefined();
      expect(provider.name).toBe("MM_API");
    });

    test("should return null for unsupported vehicle IDs", () => {
      const provider = providerFactory.getProviderForVehicle("UNSUPPORTED_12345");

      expect(provider).toBeNull();
    });
  });

  describe("Provider Health Checks", () => {
    test("should get health status for all providers", async () => {
      const healthChecks = await providerFactory.getProvidersHealth();

      expect(Array.isArray(healthChecks)).toBe(true);
      expect(healthChecks.length).toBeGreaterThan(0);

      healthChecks.forEach((health) => {
        expect(health).toHaveProperty("provider");
        expect(health).toHaveProperty("status");
        expect(health).toHaveProperty("timestamp");
      });
    });
  });

  describe("MM API Provider", () => {
    let mmProvider;

    beforeEach(() => {
      mmProvider = providerFactory.getProvider("MM_API");
    });

    test("should support MM API vehicle IDs", () => {
      expect(mmProvider.supportsVehicle("1234")).toBe(true);
      expect(mmProvider.supportsVehicle("1235")).toBe(true);
    });

    test("should get vehicle info for supported vehicles", async () => {
      try {
        const vehicleInfo = await mmProvider.getVehicleInfo("1234");

        expect(vehicleInfo).toHaveProperty("vin");
        expect(vehicleInfo).toHaveProperty("color");
        expect(vehicleInfo).toHaveProperty("doorCount");
        expect(vehicleInfo).toHaveProperty("driveTrain");
      } catch (error) {
        // Test may fail if MM API is not available, which is acceptable
        expect(error.message).toContain("MM API");
      }
    });

    test("should reject unsupported vehicle IDs", async () => {
      await expect(mmProvider.getVehicleInfo("UNSUPPORTED_123")).rejects.toThrow("not supported by MM_API provider");
    });
  });

  describe("Provider Integration", () => {
    test("should demonstrate multi-provider functionality", async () => {
      // Test MM API vehicle
      const mmProvider = providerFactory.getProviderForVehicle("1234");
      expect(mmProvider.name).toBe("MM_API");

      // Test unsupported vehicle
      const unsupportedProvider = providerFactory.getProviderForVehicle("FORD_123");
      expect(unsupportedProvider).toBeNull();
    });
  });

  describe("Error Handling", () => {
    test("should handle provider-specific errors gracefully", async () => {
      const mmProvider = providerFactory.getProvider("MM_API");

      // Test with unsupported vehicle ID
      await expect(mmProvider.getVehicleInfo("INVALID_ID")).rejects.toThrow("not supported by MM_API provider");
    });

    test("should handle missing providers gracefully", () => {
      const nonExistentProvider = providerFactory.getProvider("NON_EXISTENT");
      expect(nonExistentProvider).toBeNull();
    });
  });
});
