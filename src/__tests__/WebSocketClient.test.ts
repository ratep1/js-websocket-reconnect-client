import WebSocketClient from "../index";

// Mock WebSocket class
class MockWebSocket {
	url: string;
	protocols?: string | string[];
	readyState: number;
	onopen: ((event: Event) => void) | null = null;
	onclose: ((event: CloseEvent) => void) | null = null;
	onmessage: ((event: MessageEvent) => void) | null = null;
	onerror: ((event: Event) => void) | null = null;
	binaryType = "blob";
	bufferedAmount = 0;
	extensions = "";
	protocol = "";

	constructor(url: string, protocols?: string | string[]) {
		this.url = url;
		this.protocols = protocols;
		this.readyState = MockWebSocket.CONNECTING;

		// Simulate async connection
		setTimeout(() => {
			this.readyState = MockWebSocket.OPEN;
			if (this.onopen) {
				this.onopen({ type: "open" } as Event);
			}
		}, 0);
	}

	send(_data: string): void {
		if (this.readyState !== MockWebSocket.OPEN) {
			throw new Error("WebSocket is not open");
		}
	}

	close(): void {
		this.readyState = MockWebSocket.CLOSED;
		if (this.onclose) {
			this.onclose({
				type: "close",
				code: 1000,
				reason: "Normal closure",
			} as CloseEvent);
		}
	}

	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;
}

describe("WebSocketClient", () => {
	let client: WebSocketClient;
	const url = "ws://localhost:8080";

	beforeAll(() => {
		// Mock WebSocket globally for all tests
		vi.stubGlobal("WebSocket", MockWebSocket);
	});

	afterAll(() => {
		// Clean up the global mock
		vi.unstubAllGlobals();
	});

	beforeEach(() => {
		client = new WebSocketClient(url);
	});

	afterEach(() => {
		if (client) {
			client.close();
		}
	});

	describe("Constructor", () => {
		it("should create a client with correct URL", () => {
			expect(client.url).toBe(url);
		});

		it("should set default options", () => {
			expect(client.options.shouldReconnect).toBe(true);
			expect(client.options.reconnectRetryTimeout).toBe(1000);
			expect(client.options.parsedMessage).toBe(true);
			expect(client.options.debug).toBe(false);
		});

		it("should accept custom options", () => {
			const customOptions = {
				shouldReconnect: false,
				reconnectRetryTimeout: 5000,
			};
			const customClient = new WebSocketClient(url, undefined, customOptions);

			expect(customClient.options.shouldReconnect).toBe(false);
			expect(customClient.options.reconnectRetryTimeout).toBe(5000);
		});

		it("should accept protocols", () => {
			const protocols = ["wamp", "soap"];
			const clientWithProtocols = new WebSocketClient(url, protocols);

			expect(clientWithProtocols.protocols).toEqual(protocols);
		});
	});

	describe("Event Handlers", () => {
		it("should add onOpen handler", () => {
			const handler = vi.fn();
			client.addOnOpenHandler(handler);

			expect(client.onOpen).toBe(handler);
		});

		it("should add onMessage handler", () => {
			const handler = vi.fn();
			client.addOnMessageHandler(handler);

			expect(client.onMessage).toBe(handler);
		});

		it("should add onClose handler", () => {
			const handler = vi.fn();
			client.addOnCloseHandler(handler);

			expect(client.onClose).toBe(handler);
		});

		it("should add onError handler", () => {
			const handler = vi.fn();
			client.addOnErrorHandler(handler);

			expect(client.onError).toBe(handler);
		});
	});

	describe("Connection Management", () => {
		it("should connect successfully", () => {
			client.connect();

			expect(client.webSocket).toBeDefined();
			expect(client.shouldClose).toBe(false);
		});

		it("should close connection", () => {
			client.connect();
			client.close();

			expect(client.shouldClose).toBe(true);
		});

		it("should restart connection", () => {
			client.connect();
			client.restart();

			expect(client.shouldRestart).toBe(true);
		});
	});

	describe("Utility Methods", () => {
		beforeEach(() => {
			client.connect();
		});

		it("should get current state", () => {
			const state = client.getCurrentState();
			expect(state).toBeDefined();
		});

		it("should get URL", () => {
			const clientUrl = client.getUrl();
			expect(clientUrl).toBe(url);
		});

		it("should get protocol", () => {
			const protocol = client.getProtocol();
			expect(protocol).toBeDefined();
		});

		it("should get buffered amount", () => {
			const bufferedAmount = client.getBufferedAmount();
			expect(typeof bufferedAmount).toBe("number");
		});
	});

	describe("Message Sending", () => {
		beforeEach(async () => {
			client.connect();
			// Wait for connection to be established
			await new Promise((resolve) => setTimeout(resolve, 50));
		});

		it("should send valid JSON message", () => {
			const message = { type: "test", data: "hello" };
			const result = client.send(message);

			expect(result).toBe(true);
		});

		it("should handle invalid JSON gracefully", () => {
			// biome-ignore lint/suspicious/noExplicitAny: Needed for testing circular reference
			const circularObj: any = {};
			circularObj.self = circularObj;

			const result = client.send(circularObj);
			expect(result).toBe(false);
		});

		it("should return false when not connected", () => {
			client.close();
			const result = client.send({ test: "message" });

			expect(result).toBe(false);
		});
	});
});
