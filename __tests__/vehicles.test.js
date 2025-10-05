const {
  getVehicleInfoById,
  getDoorStatusById,
  getFuelLevelById,
  getBatteryLevelById,
  controlEngineById,
} = require("../src/handlers/vehicles");
const { createMockReq, createMockRes } = require("./utils");

describe("Vehicle API Handlers", () => {
  describe("GET /api/vehicles/:id", () => {
    test("should return vehicle information with correct structure", async () => {
      const req = createMockReq({ id: "1234" });
      const res = createMockRes();

      await getVehicleInfoById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        vin: "1213231",
        color: "Metallic Silver",
        doorCount: 4,
        driveTrain: "v8",
      });
    });

    test("should return expected placeholder data", async () => {
      const req = createMockReq({ id: "5678" });
      const res = createMockRes();

      await getVehicleInfoById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        vin: "1213231",
        color: "Metallic Silver",
        doorCount: 4,
        driveTrain: "v8",
      });
    });
  });

  describe("GET /api/vehicles/:id/doors", () => {
    test("should return door status array with correct structure", async () => {
      const req = createMockReq({ id: "1234" });
      const res = createMockRes();

      await getDoorStatusById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        { location: "frontLeft", locked: true },
        { location: "frontRight", locked: true },
        { location: "backLeft", locked: true },
        { location: "backRight", locked: false },
      ]);
    });

    test("should return expected door locations", async () => {
      const req = createMockReq({ id: "1234" });
      const res = createMockRes();

      await getDoorStatusById(req, res);

      const callArgs = res.json.mock.calls[0][0];
      const locations = callArgs.map((door) => door.location);
      expect(locations).toContain("frontLeft");
      expect(locations).toContain("frontRight");
      expect(locations).toContain("backLeft");
      expect(locations).toContain("backRight");
    });
  });

  describe("GET /api/vehicles/:id/fuel", () => {
    test("should return fuel level with correct structure", async () => {
      const req = createMockReq({ id: "1234" });
      const res = createMockRes();

      await getFuelLevelById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        percent: 30.2,
      });
    });

    test("should return expected placeholder fuel data", async () => {
      const req = createMockReq({ id: "5678" });
      const res = createMockRes();

      await getFuelLevelById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        percent: 30.2,
      });
    });
  });

  describe("GET /api/vehicles/:id/battery", () => {
    test("should return battery level with correct structure", async () => {
      const req = createMockReq({ id: "1234" });
      const res = createMockRes();

      await getBatteryLevelById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        percent: 50.3,
      });
    });

    test("should return expected placeholder battery data", async () => {
      const req = createMockReq({ id: "5678" });
      const res = createMockRes();

      await getBatteryLevelById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        percent: 50.3,
      });
    });
  });

  describe("POST /api/vehicles/:id/engine", () => {
    test("should return success status with correct structure", async () => {
      const req = createMockReq({ id: "1234" }, { action: "START" });
      const res = createMockRes();

      await controlEngineById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
      });
    });

    test("should return expected placeholder engine response", async () => {
      const req = createMockReq({ id: "1234" }, { action: "STOP" });
      const res = createMockRes();

      await controlEngineById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
      });
    });

    test("should handle STOP action", async () => {
      const req = createMockReq({ id: "5678" }, { action: "STOP" });
      const res = createMockRes();

      await controlEngineById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
      });
    });
  });

  describe("Handler Error Handling", () => {
    test("should handle errors gracefully in getVehicleInfoById", async () => {
      const req = createMockReq({ id: "invalid" });
      const res = createMockRes();

      await getVehicleInfoById(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    test("should work with different vehicle IDs", async () => {
      const req = createMockReq({ id: "9999" });
      const res = createMockRes();

      await getVehicleInfoById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        vin: "1213231",
        color: "Metallic Silver",
        doorCount: 4,
        driveTrain: "v8",
      });
    });
  });
});
