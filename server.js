const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// TODO: Import and use route modules

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
