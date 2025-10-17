import { BINARY_TYPES, STATES } from "./constants";

interface WebSocketClientOptions {
	shouldReconnect?: boolean;
	reconnectRetryTimeout?: number;
	reconnectRetryMaxNumber?: number;
	parsedMessage?: boolean;
	debug?: boolean;
}

type EventHandler = (event: Event) => void;
type MessageHandler = (message: any, event: MessageEvent) => void;
type CloseHandler = (event: CloseEvent) => void;
type ErrorHandler = (event: Event) => void;

interface IWebSocketClient {
	url: string;
	protocols?: string | string[];
	options: Required<WebSocketClientOptions>;

	webSocket?: WebSocket;
	shouldClose: boolean;
	shouldRestart: boolean;
	retryNumber: number;

	onOpen?: EventHandler;
	onMessage?: MessageHandler;
	onClose?: CloseHandler;
	onError?: ErrorHandler;
}

class WebSocketClient implements IWebSocketClient {
	url: string;
	protocols?: string | string[];
	options: Required<WebSocketClientOptions> = {
		shouldReconnect: true,
		reconnectRetryTimeout: 1000,
		parsedMessage: true,
		reconnectRetryMaxNumber: 10,
		debug: false,
	};

	webSocket?: WebSocket;
	shouldClose: boolean = false;
	shouldRestart: boolean = false;
	retryNumber: number = 0;

	onOpen?: EventHandler;
	onMessage?: MessageHandler;
	onClose?: CloseHandler;
	onError?: ErrorHandler;

	constructor(url: string, protocols?: string | string[], options?: WebSocketClientOptions) {
		this.url = url;
		if (protocols !== undefined) {
			this.protocols = protocols;
		}
		this.options = { ...this.options, ...options };
	}

	// INIT
	addOnOpenHandler = (onOpen?: EventHandler) => {
		if (onOpen !== undefined) {
			this.onOpen = onOpen;
		}
	};

	addOnMessageHandler = (onMessage?: MessageHandler) => {
		if (onMessage !== undefined) {
			this.onMessage = onMessage;
		}
	};

	addOnCloseHandler = (onClose?: CloseHandler) => {
		if (onClose !== undefined) {
			this.onClose = onClose;
		}
	};

	addOnErrorHandler = (onError?: ErrorHandler) => {
		if (onError !== undefined) {
			this.onError = onError;
		}
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
		if (this.protocols) {
			this.webSocket = new WebSocket(this.url, this.protocols);
		} else {
			this.webSocket = new WebSocket(this.url);
		}

		this.webSocket.onopen = (event) => this.onOpenHandler(event);
		this.webSocket.onmessage = (event) => this.onMessageHandler(event);
		this.webSocket.onclose = (event) => this.onCloseHandler(event);
		this.webSocket.onerror = (event) => this.onErrorHandler(event);
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
				} catch (_e) {}
			}

			this.onMessage(message, event);
		}
	}

	private onCloseHandler = (event: CloseEvent) => {
		this.debug("socket-client", "onClose", event);

		if (this.onClose) {
			this.onClose(event);
		}

		if (this.shouldRestart) {
			this.connect();
			return;
		}

		if (!this.shouldClose) {
			this.reconnect();
			return;
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
			} catch (_e) {
				return false;
			}

			try {
				this.webSocket.send(stringifiedData);
				return true;
			} catch {
				return false;
			}
		}

		return false;
	}

	restart() {
		this.shouldRestart = true;
		this.close();
	}

	reconnect() {
		const { reconnectRetryMaxNumber: maxNumber, reconnectRetryTimeout, shouldReconnect } = this.options;
		if (shouldReconnect && reconnectRetryTimeout) {
			if (maxNumber && this.retryNumber >= maxNumber) {
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
