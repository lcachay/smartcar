# Smartcar Backend Coding Challenge

A Node.js API that adapts the Madeup Motors (MM) API into a cleaner Smartcar API format.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Production Mode

To start the server in production mode:

```bash
npm start
```

This runs with `NODE_ENV=production`.

#### Development Mode

To run in development mode with auto-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change and sets `NODE_ENV=development`.

#### Debug Mode

For development with additional debug information:

```bash
npm run dev:debug
```

The server will run on `http://localhost:3000` and sets `NODE_ENV=development`.

### Testing

To run tests:

```bash
npm test
```

To run tests in watch mode (auto-rerun on file changes):

```bash
npm run test:watch
```

## Current Project Structure

```
smartcar/
├── server.js         # Express server and main entry point
├── src/              # Source code (architecture folders created)
├── __tests__/        # Test files
├── package.json      # Project configuration
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## API Routes

The API entry point is `/api`. All routes are prefixed with this base path.

### API Documentation

Interactive API documentation is available via Swagger UI at:

- **Development**: http://localhost:3000/swagger

### Vehicle Routes (`/api/vehicles`)

- `GET /api/vehicles/:id` - Get vehicle information
- `GET /api/vehicles/:id/doors` - Get door lock status
- `GET /api/vehicles/:id/fuel` - Get fuel level
- `GET /api/vehicles/:id/battery` - Get battery level
- `POST /api/vehicles/:id/engine` - Start/stop engine

### Provider Routes (`/api/providers`)

- `GET /api/providers/info` - Get provider information
- `GET /api/providers/health` - Get health status of all providers

## Provider Architecture

The Smartcar API uses a provider-based architecture to support multiple vehicle data sources.

### How Providers Work

1. **Base Provider Class**: All providers extend the `BaseVehicleProvider` abstract class, ensuring they implement the required methods:

   - `getVehicleInfo(vehicleId)` - Get basic vehicle information
   - `getDoorStatus(vehicleId)` - Get door lock status
   - `getFuelLevel(vehicleId)` - Get fuel level data
   - `getBatteryLevel(vehicleId)` - Get battery level data
   - `controlEngine(vehicleId, action)` - Start/stop engine
   - `supportsVehicle(vehicleId)` - Check if provider supports a vehicle
   - `getHealthStatus()` - Provider health check

2. **Provider Factory**: The `ProviderFactory` manages all providers and routes requests to the appropriate provider based on vehicle ID.

3. **Data Mapping**: Each provider transforms external API responses into the standardized Smartcar format using mapper functions.

### Current Providers

- **MM API Provider** (`MMApiProvider`): Integrates with the Madeup Motors API
  - Supports vehicle IDs: `1234`, `1235`
  - Handles MM API-specific response formats and error codes
  - Includes health monitoring and response time tracking

### Adding a New Provider

To add a new vehicle API provider, follow these steps:

1. **Create Provider Class**: Create a new file in `src/providers/` (e.g., `NewApiProvider.js`):

```javascript
const BaseVehicleProvider = require("./BaseVehicleProvider");

class NewApiProvider extends BaseVehicleProvider {
  constructor(config = {}) {
    super("NEW_API", config);
    this.supportedVehicleIds = config.supportedVehicleIds || [];
  }

  supportsVehicle(vehicleId) {
    return this.supportedVehicleIds.includes(vehicleId);
  }

  async getVehicleInfo(vehicleId) {
    // Implement API call and response mapping
  }

  async getDoorStatus(vehicleId) {
    // Implement API call and response mapping
  }

  async getFuelLevel(vehicleId) {
    // Implement API call and response mapping
  }

  async getBatteryLevel(vehicleId) {
    // Implement API call and response mapping
  }

  async controlEngine(vehicleId, action) {
    // Implement API call and response mapping
  }

  async getHealthStatus() {
    // Implement health check logic
  }
}

module.exports = NewApiProvider;
```

2. **Create Service Functions**: Add API service functions in `src/services/` for external API communication.

3. **Add Data Mappers**: Create mapper functions in `src/utils/mappers.js` to transform the external API responses to Smartcar format.

4. **Register Provider**: Add the provider to `ProviderFactory.js`:

```javascript
// In initializeProviders() method
const newApiConfig = {
  supportedVehicleIds: ["5678", "9012"],
};
this.registerProvider("NEW_API", NewApiProvider, newApiConfig);
```

5. **Add Tests**: Create comprehensive tests in `__tests__/` directory.

### Provider Configuration

Each provider can be configured with:

- **Supported Vehicle IDs**: List of vehicle IDs the provider can handle
- **API Endpoints**: Base URLs and endpoint configurations
- **Timeouts**: Request timeout settings

### Error Handling

Providers use standardized error types:

- `NotFoundError`: Vehicle not found or not supported
- `ExternalServiceError`: External API failures
- `ValidationError`: Invalid input parameters

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework for Node.js
- **Axios** - Promise-based HTTP client for making API requests
- **Swagger UI Express** - Interactive API documentation interface
- **Swagger JSDoc** - Generate OpenAPI specifications from JSDoc comments
- **Pino** - Fast JSON logger for Node.js
- **Pino-HTTP** - HTTP request logging middleware for Express
- **Pino-Pretty** - Pretty printing for Pino logs in development
- **Zod** - TypeScript-first schema validation library
- **Jest** - JavaScript testing framework with built-in assertions and mocking
- **Nodemon** - Development server with auto-restart on file changes
- **Cross-env** - Cross-platform environment variable setting
