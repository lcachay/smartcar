const getVehicleInfoById = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    // TODO: Call MM API /v1/getVehicleInfoService
    // TODO: Transform response to Smartcar format

    // Mock response
    res.json({
      vin: "1213231",
      color: "Metallic Silver",
      doorCount: 4,
      driveTrain: "v8",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDoorStatusById = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    // TODO: Call MM API /v1/getSecurityStatusService
    // TODO: Transform response to Smartcar format

    // Mock response
    res.json([
      {
        location: "frontLeft",
        locked: true,
      },
      {
        location: "frontRight",
        locked: true,
      },
      {
        location: "backLeft",
        locked: true,
      },
      {
        location: "backRight",
        locked: false,
      },
    ]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFuelLevelById = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    // TODO: Call MM API /v1/getEnergyService
    // TODO: Extract fuel data and transform

    // Mock response
    res.json({
      percent: 30.2,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBatteryLevelById = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    // TODO: Call MM API /v1/getEnergyService
    // TODO: Extract battery data and transform

    // Mock response
    res.json({
      percent: 50.3,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const controlEngineById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const { action } = req.body;

    // TODO: Validate action is 'START' or 'STOP'
    // TODO: Call MM API /v1/actionEngineService
    // TODO: Transform response

    // Mock response
    res.json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getVehicleInfoById,
  getDoorStatusById,
  getFuelLevelById,
  getBatteryLevelById,
  controlEngineById,
};
