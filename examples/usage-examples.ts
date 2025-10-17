import WebSocketClient from '../src/index';

// Example 1: Basic Usage
console.log('🚀 Example 1: Basic WebSocket Client');

const basicClient = new WebSocketClient('ws://echo.websocket.org');

basicClient.addOnOpenHandler(() => {
  console.log('✅ Connected to echo server');
  basicClient.send({ message: 'Hello from TypeScript client!' });
});

basicClient.addOnMessageHandler((message, event) => {
  console.log('📥 Received:', message);
});

basicClient.addOnCloseHandler((event) => {
  console.log('❌ Connection closed:', event.code, event.reason);
});

basicClient.addOnErrorHandler((event) => {
  console.error('⚠️ Error occurred:', event);
});

// Connect
basicClient.connect();

// Example 2: Advanced Configuration
console.log('\n🔧 Example 2: Advanced Configuration');

const advancedClient = new WebSocketClient(
  'ws://echo.websocket.org',
  ['echo-protocol'],
  {
    shouldReconnect: true,
    reconnectRetryTimeout: 2000,
    reconnectRetryMaxNumber: 5,
    parsedMessage: true,
    debug: true
  }
);

advancedClient.addOnOpenHandler(() => {
  console.log('🔗 Advanced client connected');
  
  // Send different types of messages
  advancedClient.send({ type: 'greeting', text: 'Hello!' });
  advancedClient.send({ type: 'data', numbers: [1, 2, 3, 4, 5] });
  advancedClient.send({ type: 'timestamp', time: new Date().toISOString() });
});

advancedClient.addOnMessageHandler((message) => {
  console.log('📨 Advanced client received:', message);
});

// Connect after a delay
setTimeout(() => {
  advancedClient.connect();
}, 2000);

// Example 3: Connection Management
console.log('\n⚙️ Example 3: Connection Management');

const managedClient = new WebSocketClient('ws://echo.websocket.org');

managedClient.addOnOpenHandler(() => {
  console.log('🟢 Managed client connected');
  console.log('📊 Connection state:', managedClient.getCurrentState());
  console.log('🌐 URL:', managedClient.getUrl());
  console.log('📡 Protocol:', managedClient.getProtocol());
  
  // Send a message
  const success = managedClient.send({ action: 'ping' });
  console.log('📤 Message sent successfully:', success);
});

managedClient.addOnMessageHandler((message) => {
  console.log('📬 Managed client received:', message);
  
  // Close after receiving response
  setTimeout(() => {
    console.log('🔄 Restarting connection...');
    managedClient.restart();
  }, 1000);
});

// Connect the managed client
setTimeout(() => {
  managedClient.connect();
}, 4000);

// Cleanup after examples
setTimeout(() => {
  console.log('\n🧹 Cleaning up connections...');
  basicClient.close();
  advancedClient.close();
  managedClient.close();
  console.log('✨ Examples completed!');
}, 10000);