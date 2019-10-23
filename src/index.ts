import { BINARY_TYPES, STATES } from "./constants";

interface IWebSocketClient {
  url: string;
  protocols?: string | string[];
  options: {
    shouldReconnect: boolean;
    reconnectRetryTimeout: number;
    reconnectRetryMaxNumber?: number;
    parsedMessage: boolean;
  };

  webSocket?: WebSocket;
  shouldClose: boolean;
  shouldRestart: boolean;
  retryNumber: number;

  onOpen?: Function;
  onMessage?: Function;
  onClose?: Function;
  onError?: Function;
}

class WebSocketClient implements IWebSocketClient {
  url: string;
  protocols?: string | string[];
  options: {
    shouldReconnect: boolean;
    reconnectRetryTimeout: number;
    parsedMessage: boolean;
    reconnectRetryMaxNumber?: number;
  } = {
    shouldReconnect: true,
    reconnectRetryTimeout: 1000,
    parsedMessage: true
  };

  webSocket?: WebSocket;
  shouldClose: boolean = false;
  shouldRestart: boolean = false;
  retryNumber: number = 0;

  onOpen?: Function;
  onMessage?: Function;
  onClose?: Function;
  onError?: Function;

  constructor(
    url: string,
    protocols?: string | string[],
    options?: { shouldReconnect: boolean; reconnectRetry: number },
    onOpen?: Function,
    onMessage?: Function,
    onClose?: Function,
    onError?: Function
  ) {
    this.url = url;
    this.protocols = protocols;
    this.options = options ? { ...this.options, ...options } : this.options;
    this.onOpen = onOpen;
    this.onMessage = onMessage;
    this.onClose = onClose;
    this.onError = onError;
  }

  // HELPERS
  getCurrentState() {
    let state = null;
    if (this.webSocket) {
      state = STATES[this.webSocket.readyState];
    }
    return state;
  }

  getBinaryType() {
    let binaryType = null;
    if (this.webSocket) {
      binaryType = BINARY_TYPES[this.webSocket.binaryType];
    }
    return binaryType;
  }

  getBufferedAmount() {
    let bufferedAmount = null;
    if (this.webSocket) {
      bufferedAmount = this.webSocket.bufferedAmount;
    }
    return bufferedAmount;
  }

  getExtensions() {
    let extensions = null;
    if (this.webSocket) {
      extensions = this.webSocket.extensions;
    }
    return extensions;
  }

  getProtocol() {
    let protocol = null;
    if (this.webSocket) {
      protocol = this.webSocket.protocol;
    }
    return protocol;
  }

  getUrl() {
    let url = null;
    if (this.webSocket) {
      url = this.webSocket.url;
    }
    return url;
  }

  // LIFE CYCLE

  connect() {
    this.shouldClose = false;
    this.webSocket = new WebSocket(this.url);

    this.webSocket.onopen = event => this.onOpenHandler(event);
    this.webSocket.onmessage = event => this.onMessageHandler(event);
    this.webSocket.onclose = event => this.onCloseHandler(event);
    this.webSocket.onerror = event => this.onErrorHandler(event);

    // onconnect retryNumber = 0
    // onclose if should restart -> connect() && shouldRestart = false
  }

  private onOpenHandler(event: Event) {
    this.retryNumber = 0;
    if (this.onOpen) {
      this.onOpen(event);
    }
  }

  private onMessageHandler(event: MessageEvent) {
    if (this.onMessage) {
      let message = event.data;
      if (this.options.parsedMessage) {
        try {
          message = JSON.parse(message);
        } catch (e) {}
      }

      this.onMessage(message);
    }
  }

  private onCloseHandler = (event: CloseEvent) => {
    if (this.shouldRestart) {
      this.connect();
      return;
    }

    if (!this.shouldClose) {
      this.reconnect();
      return;
    }

    if (this.onClose) {
      this.onClose(event);
    }
  };

  private onErrorHandler(event: Event) {
    if (this.onError) {
      this.onError(event);
    }
    this.close(true);
  }

  send(data: any) {
    if (this.webSocket) {
      let stringifiedData = null;
      try {
        stringifiedData = JSON.stringify(data);
      } catch (e) {
        return false;
      }

      this.webSocket.send(stringifiedData);
      return true;
    }

    return false;
  }

  restart() {
    this.shouldRestart = true;
    this.close();
  }

  reconnect() {
    const {
      reconnectRetryMaxNumber: maxNumber,
      reconnectRetryTimeout,
      shouldReconnect
    } = this.options;
    if (shouldReconnect && reconnectRetryTimeout) {
      if (maxNumber && this.retryNumber > maxNumber) {
        return;
      }
      this.retryNumber++;
      setTimeout(() => {
        this.connect();
      }, reconnectRetryTimeout);
    }
  }

  close(reconnect?: boolean) {
    if (this.webSocket) {
      this.shouldClose = !reconnect;
      this.webSocket.close();
    }
  }
}

export default WebSocketClient;
