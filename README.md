# WebSocket Client with Automatic Reconnect

[![npm version](https://badge.fury.io/js/js-websocket-reconnect-client.svg)](https://badge.fury.io/js/js-websocket-reconnect-client)
[![CI/CD](https://github.com/ratep1/js-websocket-reconnect-client/workflows/CI%2FCD/badge.svg)](https://github.com/ratep1/js-websocket-reconnect-client/actions)
[![codecov](https://codecov.io/gh/ratep1/js-websocket-reconnect-client/branch/master/graph/badge.svg)](https://codecov.io/gh/ratep1/js-websocket-reconnect-client)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A lightweight, modern TypeScript WebSocket client library with automatic reconnection capabilities, comprehensive error handling, and full type safety.

## ✨ Features

- 🔄 **Automatic Reconnection** - Intelligent reconnection with configurable retry strategies
- 📦 **TypeScript First** - Full type safety and IntelliSense support
- 🎯 **Event-Driven** - Clean event handler system
- 🛡️ **Error Handling** - Robust error handling and recovery
- 🧪 **Well Tested** - Comprehensive test suite with Vitest
- 🌐 **Universal** - Works in browsers and Node.js environments
- 📱 **Lightweight** - Minimal bundle size with zero dependencies

## 📦 Installation

Using yarn (recommended):
```bash
yarn add js-websocket-reconnect-client
```

Using npm:
```bash
npm install js-websocket-reconnect-client
```

> **Note**: This project uses Yarn as the preferred package manager. All examples show both yarn and npm commands.

## 🚀 Quick Start

```typescript
import WebSocketClient from 'js-websocket-reconnect-client';

const client = new WebSocketClient('ws://localhost:8080');

// Set up event handlers
client.addOnOpenHandler(() => {
  console.log('Connected to WebSocket server');
});

client.addOnMessageHandler((message, event) => {
  console.log('Received message:', message);
});

client.addOnCloseHandler((event) => {
  console.log('Connection closed:', event.code, event.reason);
});

client.addOnErrorHandler((event) => {
  console.error('WebSocket error:', event);
});

// Connect
client.connect();

// Send messages
client.send({ type: 'greeting', message: 'Hello Server!' });
```

## 🔧 Configuration

### Constructor Options

```typescript
new WebSocketClient(url, protocols?, options?)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | ✅ | WebSocket server URL |
| `protocols` | `string \| string[]` | ❌ | Sub-protocols |
| `options` | `WebSocketClientOptions` | ❌ | Configuration options |

#### Options Interface

```typescript
interface WebSocketClientOptions {
  shouldReconnect?: boolean;          // Enable automatic reconnection (default: true)
  reconnectRetryTimeout?: number;     // Delay between reconnection attempts in ms (default: 1000)
  reconnectRetryMaxNumber?: number;   // Maximum number of reconnection attempts (default: 10)
  parsedMessage?: boolean;            // Auto-parse JSON messages (default: true)
  debug?: boolean;                    // Enable debug logging (default: false)
}
```

### Example with Custom Options

```typescript
const client = new WebSocketClient('ws://localhost:8080', ['wamp', 'soap'], {
  shouldReconnect: true,
  reconnectRetryTimeout: 2000,
  reconnectRetryMaxNumber: 5,
  parsedMessage: true,
  debug: true
});
```

## 📚 API Reference

### Event Handlers

#### addOnOpenHandler(handler)
Set the connection open event handler.
```typescript
client.addOnOpenHandler((event: Event) => {
  console.log('WebSocket connection opened');
});
```

#### addOnMessageHandler(handler)
Set the message received event handler.
```typescript
client.addOnMessageHandler((message: any, event: MessageEvent) => {
  console.log('Message received:', message);
});
```

#### addOnCloseHandler(handler)
Set the connection close event handler.
```typescript
client.addOnCloseHandler((event: CloseEvent) => {
  console.log('Connection closed:', event.code, event.reason);
});
```

#### addOnErrorHandler(handler)
Set the error event handler.
```typescript
client.addOnErrorHandler((event: Event) => {
  console.error('WebSocket error occurred');
});
```

### Connection Management

#### connect()
Establish WebSocket connection.
```typescript
client.connect();
```

#### close(reconnect?: boolean)
Close the WebSocket connection.
```typescript
client.close(); // Close permanently
client.close(true); // Close and allow reconnection
```

#### restart()
Restart the WebSocket connection.
```typescript
client.restart();
```

#### send(data: any)
Send data through the WebSocket connection.
```typescript
const success = client.send({ type: 'message', data: 'Hello!' });
if (success) {
  console.log('Message sent successfully');
}
```

### Utility Methods

#### getCurrentState()
Get the current WebSocket connection state.
```typescript
const state = client.getCurrentState(); // "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED"
```

#### getUrl()
Get the WebSocket URL.
```typescript
const url = client.getUrl();
```

#### getProtocol()
Get the active protocol.
```typescript
const protocol = client.getProtocol();
```

#### getBinaryType()
Get the binary data type.
```typescript
const binaryType = client.getBinaryType();
```

#### getBufferedAmount()
Get the amount of buffered data.
```typescript
const buffered = client.getBufferedAmount();
```

## 🧪 Development

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/ratep1/js-websocket-reconnect-client.git
cd js-websocket-reconnect-client

# Install dependencies
yarn install
# or
npm install

# Run tests
yarn test
# or
npm test

# Build the project
yarn build
# or
npm run build

# Run code quality checks
yarn check
# or
npm run check
```

### Scripts

| Script | Description |
|--------|-------------|
| `yarn build` / `npm run build` | Build the project with Vite |
| `yarn build:watch` / `npm run build:watch` | Build in watch mode with Vite |
| `yarn dev` / `npm run dev` | Start Vite development server |
| `yarn test` / `npm test` | Run Vitest tests |
| `yarn test:watch` / `npm run test:watch` | Run tests in watch mode |
| `yarn test:coverage` / `npm run test:coverage` | Run tests with coverage report |
| `yarn test:ui` / `npm run test:ui` | Open Vitest UI for interactive testing |
| `yarn check` / `npm run check` | Run Biome checks (lint + format) |
| `yarn check:fix` / `npm run check:fix` | Fix Biome issues automatically |
| `yarn format` / `npm run format` | Format code with Biome |
| `yarn format:check` / `npm run format:check` | Check code formatting |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛠️ Built With

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [Vitest](https://vitest.dev/) - Blazing fast testing framework
- [Biome](https://biomejs.dev/) - Fast formatter and linter

## 📈 Changelog

### v0.0.13
- 🎉 Complete modernization with TypeScript 5.x
- ✅ Added comprehensive test suite
- 🔧 Modern development tooling (ESLint, Prettier, Jest)
- 📚 Updated documentation
- 🐛 Fixed WebSocket state constants bug
- 🚀 CI/CD pipeline with GitHub Actions

## 📚 Documentation

- [Publishing Guide](docs/PUBLISHING.md) - How to publish new versions
- [API Reference](docs/API.md) - Complete API documentation
- [Examples](examples/) - Usage examples and demos

---

Made with ❤️ by [ratep1](https://github.com/ratep1)
