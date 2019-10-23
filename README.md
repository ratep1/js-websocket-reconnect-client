# WebSocket Client with reconnect

This is light-weight JavaScript WebSocket library that supports reconnect

## Installation

To install the stable version if you are using [npm](https://www.npmjs.com/):

`npm install js-websocket-reconnect-client`

or if you are using [yarn](https://yarnpkg.com/):

`yarn add js-websocket-reconnect-client`

## Description

## Usage

Import js-websocket-reconnect-client module if you are using ES modules:

`import WebSocketClient from 'js-websocket-reconnect-client';`

This is simple example of js-websocket-reconnect-client usage:

```
import WebSocketClient from 'js-websocket-reconnect-client';

const URL = 'http://localhost:8000/ws'; // set your url defined on server

const ws = new WebSocketClient(url);

ws.addOnMessageHandler(message => {
    console.log('[socket] message received', message);
});

ws.connect();
```
