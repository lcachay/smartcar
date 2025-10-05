const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const routes = require("./src/routes");
app.use("/api", routes);

// Start server
function startServer() {
  return app.listen(port, () => {
    console.log(`Smartcar API server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
