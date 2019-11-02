import { BINARY_TYPES, STATES } from "./constants";

interface IWebSocketClient {
  url: string;
  protocols?: string | string[];
  options: {
    shouldReconnect: boolean;
    reconnectRetryTimeout: number;
    reconnectRetryMaxNumber?: number;
    parsedMessage: boolean;
    debug?: boolean;
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
    debug?: boolean;
  } = {
    shouldReconnect: true,
    reconnectRetryTimeout: 1000,
    parsedMessage: true,
    debug: false
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
    options?: { shouldReconnect: boolean; reconnectRetry: number }
  ) {
    this.url = url;
    this.protocols = protocols || undefined;
    this.options = options ? { ...this.options, ...options } : this.options;
  }

  // INIT
  addOnOpenHandler = (onOpen?: Function) => {
    this.onOpen = onOpen;
  };

  addOnMessageHandler = (onMessage?: Function) => {
    this.onMessage = onMessage;
  };

  addOnCloseHandler = (onClose?: Function) => {
    this.onClose = onClose;
  };

  addOnErrorHandler = (onError?: Function) => {
    this.onError = onError;
  };

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

  private debug(idn: string, message: string, data: any) {
    if (this.options.debug) {
      console.log(`[${idn}] ${message}`, data);
    }
  }

  // LIFE CYCLE

  connect() {
    this.shouldClose = false;
    this.webSocket = new WebSocket(this.url, this.protocols);

    this.webSocket.onopen = event => this.onOpenHandler(event);
    this.webSocket.onmessage = event => this.onMessageHandler(event);
    this.webSocket.onclose = event => this.onCloseHandler(event);
    this.webSocket.onerror = event => this.onErrorHandler(event);
  }

  private onOpenHandler(event: Event) {
    this.debug("socket-client", "onOpen", event);
    this.retryNumber = 0;
    if (this.onOpen) {
      this.onOpen(event);
    }
  }

  private onMessageHandler(event: MessageEvent) {
    this.debug("socket-client", "onMessage", event);

    if (this.onMessage) {
      let message = event.data;
      if (this.options.parsedMessage) {
        try {
          message = JSON.parse(message);
        } catch (e) {}
      }

      this.onMessage(message, event);
    }
  }

  private onCloseHandler = (event: CloseEvent) => {
    this.debug("socket-client", "onClose", event);

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
    this.debug("socket-client", "onError", event);

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
