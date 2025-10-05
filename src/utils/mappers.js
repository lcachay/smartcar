/**
 * Map MM API vehicle info to Smartcar format
 * @param {Object} mmResponse - MM API response object
 * @returns {Object} - Smartcar formatted vehicle info
 */
const mapVehicleInfo = (mmResponse) => {
  if (!mmResponse?.body?.data) {
    throw new Error("Invalid MM API vehicle info response");
  }

  const { data } = mmResponse.body;

  // Extract values from MM API's nested structure
  const vin = data.vin?.value || "";
  const color = data.color?.value || "";
  const driveTrain = data.driveTrain?.value || "";

  // Determine door count from boolean flags
  let doorCount = 4; // Default assumption
  if (data.twoDoorCoupe?.value === "True" || data.twoDoorCoupe?.value === true) {
    doorCount = 2;
  } else if (data.fourDoorSedan?.value === "True" || data.fourDoorSedan?.value === true) {
    doorCount = 4;
  }

  return {
    vin,
    color,
    doorCount,
    driveTrain,
  };
};

/**
 * Map MM API security status to Smartcar format
 * @param {Object} mmResponse - MM API response object
 * @returns {Array} - Smartcar formatted door status array
 */
const mapDoorStatus = (mmResponse) => {
  if (!mmResponse?.body?.data?.doors?.values) {
    throw new Error("Invalid MM API security status response");
  }

  const doors = mmResponse.body.data.doors.values;

  return doors.map((door) => {
    const location = door.location?.value || "";
    // MM API returns string 'True'/'False', convert to boolean
    const lockedValue = door.locked?.value;
    const locked = lockedValue === "True" || lockedValue === true;

    return {
      location,
      locked,
    };
  });
};

/**
 * Map MM API energy info to Smartcar fuel format
 * @param {Object} mmResponse - MM API response object
 * @returns {Object} - Smartcar formatted fuel level
 */
const mapFuelLevel = (mmResponse) => {
  if (!mmResponse?.body?.data?.tankLevel) {
    throw new Error("Invalid MM API energy response or no fuel data");
  }

  const tankLevel = mmResponse.body.data.tankLevel;

  // MM API returns string numbers, convert to float
  const percent = parseFloat(tankLevel.value);

  if (isNaN(percent)) {
    throw new Error("Invalid fuel level value from MM API");
  }

  return {
    percent,
  };
};

/**
 * Map MM API energy info to Smartcar battery format
 * @param {Object} mmResponse - MM API response object
 * @returns {Object} - Smartcar formatted battery level
 */
const mapBatteryLevel = (mmResponse) => {
  if (!mmResponse?.body?.data?.batteryLevel) {
    throw new Error("Invalid MM API energy response or no battery data");
  }

  const batteryLevel = mmResponse.body.data.batteryLevel;

  // Check if battery data is null (for non-electric vehicles)
  if (batteryLevel.type === "Null" || batteryLevel.value === "null" || batteryLevel.value === null) {
    // Return a default or throw an error for vehicles without batteries
    throw new Error("Vehicle does not have battery data");
  }

  // MM API returns string numbers, convert to float
  const percent = parseFloat(batteryLevel.value);

  if (isNaN(percent)) {
    throw new Error("Invalid battery level value from MM API");
  }

  return {
    percent,
  };
};

/**
 * Map MM API engine action result to Smartcar format
 * @param {Object} mmResponse - MM API response object
 * @returns {Object} - Smartcar formatted action result
 */
const mapEngineAction = (mmResponse) => {
  if (!mmResponse?.body?.actionResult) {
    throw new Error("Invalid MM API engine action response");
  }

  const actionResult = mmResponse.body.actionResult;

  // MM API returns 'EXECUTED' or 'FAILED'
  // Smartcar expects 'success' or 'error'
  const status = actionResult.status === "EXECUTED" ? "success" : "error";

  return {
    status,
  };
};

/**
 * Convert Smartcar engine action to MM API command
 * @param {string} action - Smartcar action ('START' or 'STOP')
 * @returns {string} - MM API command ('START_VEHICLE' or 'STOP_VEHICLE')
 */
const convertEngineAction = (action) => {
  const actionMap = {
    START: "START_VEHICLE",
    STOP: "STOP_VEHICLE",
  };

  const command = actionMap[action?.toUpperCase()];

  if (!command) {
    throw new Error(`Invalid engine action: ${action}. Must be 'START' or 'STOP'`);
  }

  return command;
};

module.exports = {
  mapVehicleInfo,
  mapDoorStatus,
  mapFuelLevel,
  mapBatteryLevel,
  mapEngineAction,
  convertEngineAction,
};
