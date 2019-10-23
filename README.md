# WebSocket Client with automatically reconnect

This is light-weight JavaScript WebSocket library that supports reconnect

## Installation

To install the stable version if you are using [npm](https://www.npmjs.com/):

```shell
npm install js-websocket-reconnect-client
```

or if you are using [yarn](https://yarnpkg.com/):

```shell
yarn add js-websocket-reconnect-client
```

## Description

This module is wrapper around [WebSocket](hhttps://developer.mozilla.org/en-US/docs/Web/API/WebSocket) that added few more functionalities.

The `WebSocketClient` object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.

## Usage

Import js-websocket-reconnect-client module if you are using ES modules:

```typescript
import WebSocketClient from "js-websocket-reconnect-client";
```

This is simple example of js-websocket-reconnect-client usage:

```typescript
import WebSocketClient from "js-websocket-reconnect-client";

const URL = "http://localhost:8000/ws/"; // set your url defined on server

const ws = new WebSocketClient(url);

ws.addOnMessageHandler(message => {
  console.log("[socket] message received", message);
});

ws.connect();
```

### Creating object

This is definition for creating new object:

```typescript
new WebSocketClient(
  url: string,
  protocols?: string | string[],
  options?: {
    shouldReconnect: boolean;
    reconnectRetry: number;
  }
);
```

Example:

```typescript
import WebSocketClient from 'js-websocket-reconnect-client';

const url = "http://your.cool.domain/ws/";
const protocols = ["wamp", "soap"];
const options = {
  shouldReconnect: true;
  reconnectRetryTimeout: 2000;
  parsedMessage: true;
  reconnectRetryMaxNumber: 10;
  debug: false;
}

const webSocket = new WebSocketClient(url, protocols, options);
```

#### Url

URL is required parameter of type `string`.
It specifies WebSocket connection endpoint. This should be the URL to which the WebSocket server will respond.

Example:

```typescript
const url = "http://your.cool.domain/ws/";
```

#### Protocols

Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol). If you don't specify a `protocol` string, an empty string is assumed.

Example:

```typescript
const protocol = ["wamp", "soap"];
```

#### Options

Options are extended, custom part of this package. It is possible to specify several important features. If `options` object is not specified, a default values are is assumed.

Definition:

```typescript
options: {
  shouldReconnect: boolean;
  reconnectRetryTimeout: number;
  parsedMessage: boolean;
  reconnectRetryMaxNumber?: number;
  debug?: boolean;
}
```

Default:

```javascript
const options = {
  shouldReconnect: true,
  reconnectRetryTimeout: 1000,
  parsedMessage: true,
  debug: false
};
```

Example:

```javascript
const options = {
  shouldReconnect: true;
  reconnectRetryTimeout: 2000;
  parsedMessage: true;
  reconnectRetryMaxNumber: 10;
  debug: false;
}
```
