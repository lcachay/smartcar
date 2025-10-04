const { app } = require("../server");

describe("Smartcar API", () => {
  test("Initial test", () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe("function");
  });
});
