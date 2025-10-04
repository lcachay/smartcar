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

To start the Express server:

```bash
npm start
```

The server will run on `http://localhost:3000`

### Development

To run in development mode:

```bash
npm run dev
```

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
├── utils.js          # Utility functions
├── src/              # Source code (architecture folders created)
├── __tests__/        # Test files
├── package.json      # Project configuration
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Jest** - Testing framework
