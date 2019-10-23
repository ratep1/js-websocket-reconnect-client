# WebSocket Client with automatically reconnect

This is light-weight JavaScript WebSocket library that supports reconnect

## Installation

To install the stable version if you are using [npm](https://www.npmjs.com/):

`npm install js-websocket-reconnect-client`

or if you are using [yarn](https://yarnpkg.com/):

`yarn add js-websocket-reconnect-client`

## Description

This module is wrapper around [WebSocket](hhttps://developer.mozilla.org/en-US/docs/Web/API/WebSocket) that added few more functionalities.

The `WebSocketClient` object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.

## Usage

Import js-websocket-reconnect-client module if you are using ES modules:

`import WebSocketClient from 'js-websocket-reconnect-client';`

This is simple example of js-websocket-reconnect-client usage:

```
import WebSocketClient from 'js-websocket-reconnect-client';

const URL = 'http://localhost:8000/ws/'; // set your url defined on server

const ws = new WebSocketClient(url);

ws.addOnMessageHandler(message => {
    console.log('[socket] message received', message);
});

ws.connect();
```

### Creating object

This is syntax for creating new object:

```
new WebSocketClient(
    url: string,
    protocols?: string | string[],
    options?: {
        shouldReconnect: boolean;
        reconnectRetry: number;
    }
);
```

#### Url

Url is required parameter of type `string`.
It is specifies WebSocket connection endpoint.

Example: 

`const url = 'http://your.cool.domain/ws/';`

#### Protocols

#### Options
