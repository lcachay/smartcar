/**
 * Tests for data mappers
 * These test the conversion between MM API format and Smartcar format
 */

const {
  mapVehicleInfo,
  mapDoorStatus,
  mapFuelLevel,
  mapBatteryLevel,
  mapEngineAction,
  convertEngineAction,
} = require("../src/utils/mappers");

describe("Data Mappers", () => {
  describe("mapVehicleInfo", () => {
    test("should map MM API vehicle info to Smartcar format", () => {
      const mmResponse = {
        body: {
          data: {
            vin: { value: "123123412412" },
            color: { value: "Metallic Silver" },
            fourDoorSedan: { value: "True" },
            twoDoorCoupe: { value: "False" },
            driveTrain: { value: "v8" },
          },
        },
      };

      const result = mapVehicleInfo(mmResponse);

      expect(result).toEqual({
        vin: "123123412412",
        color: "Metallic Silver",
        doorCount: 4,
        driveTrain: "v8",
      });
    });
  });

  describe("mapDoorStatus", () => {
    test("should map MM API door status to Smartcar format", () => {
      const mmResponse = {
        body: {
          data: {
            doors: {
              values: [
                { location: { value: "frontLeft" }, locked: { value: "True" } },
                { location: { value: "frontRight" }, locked: { value: "False" } },
              ],
            },
          },
        },
      };

      const result = mapDoorStatus(mmResponse);

      expect(result).toEqual([
        { location: "frontLeft", locked: true },
        { location: "frontRight", locked: false },
      ]);
    });
  });

  describe("mapFuelLevel", () => {
    test("should map MM API fuel level to Smartcar format", () => {
      const mmResponse = {
        body: {
          data: {
            tankLevel: { value: "30.2" },
          },
        },
      };

      const result = mapFuelLevel(mmResponse);
      expect(result).toEqual({ percent: 30.2 });
    });
  });

  describe("convertEngineAction", () => {
    test("should map START to START_VEHICLE", () => {
      expect(convertEngineAction("START")).toBe("START_VEHICLE");
    });

    test("should map STOP to STOP_VEHICLE", () => {
      expect(convertEngineAction("STOP")).toBe("STOP_VEHICLE");
    });
  });
});
