import WebSocketClient from "../index";

// Mock WebSocket for testing reconnection behavior
class MockWebSocketWithReconnect {
	static instances: MockWebSocketWithReconnect[] = [];
	static shouldFailNext: boolean = false;
	static failureCount: number = 0;

	url: string;
	protocols?: string | string[];
	readyState: number;
	onopen: ((event: Event) => void) | null = null;
	onclose: ((event: CloseEvent) => void) | null = null;
	onmessage: ((event: MessageEvent) => void) | null = null;
	onerror: ((event: Event) => void) | null = null;
	binaryType: string = "blob";
	bufferedAmount: number = 0;
	extensions: string = "";
	protocol: string = "";
	shouldFailConnection: boolean = false;

	constructor(url: string, protocols?: string | string[]) {
		this.url = url;
		this.protocols = protocols;
		this.readyState = MockWebSocketWithReconnect.CONNECTING;
		MockWebSocketWithReconnect.instances.push(this);

		// Check if this connection should fail
		if (MockWebSocketWithReconnect.shouldFailNext) {
			this.shouldFailConnection = true;
		}

		// Simulate async connection
		setTimeout(() => {
			if (this.shouldFailConnection) {
				this.readyState = MockWebSocketWithReconnect.CLOSED;
				MockWebSocketWithReconnect.failureCount++;
				if (this.onerror) {
					this.onerror({ type: "error", target: this } as unknown as Event);
				}
				if (this.onclose) {
					this.onclose({
						type: "close",
						code: 1006,
						reason: "Connection failed",
						target: this,
					} as unknown as CloseEvent);
				}
			} else {
				this.readyState = MockWebSocketWithReconnect.OPEN;
				if (this.onopen) {
					this.onopen({ type: "open", target: this } as unknown as Event);
				}
			}
		}, 10);
	}

	send(data: string): void {
		if (this.readyState !== MockWebSocketWithReconnect.OPEN) {
			throw new Error("WebSocket is not open");
		}

		// Echo the message back
		setTimeout(() => {
			if (this.onmessage) {
				this.onmessage({
					type: "message",
					data: data,
					target: this,
				} as unknown as MessageEvent);
			}
		}, 5);
	}

	close(): void {
		this.readyState = MockWebSocketWithReconnect.CLOSED;
		setTimeout(() => {
			if (this.onclose) {
				this.onclose({
					type: "close",
					code: 1000,
					reason: "Normal closure",
					target: this,
				} as unknown as CloseEvent);
			}
		}, 5);
	}

	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;

	static reset() {
		MockWebSocketWithReconnect.instances = [];
		MockWebSocketWithReconnect.shouldFailNext = false;
		MockWebSocketWithReconnect.failureCount = 0;
	}

	static getLastInstance() {
		return MockWebSocketWithReconnect.instances[MockWebSocketWithReconnect.instances.length - 1];
	}
}

describe("WebSocketClient - Advanced Features", () => {
	beforeAll(() => {
		vi.stubGlobal("WebSocket", MockWebSocketWithReconnect);
	});

	beforeEach(() => {
		MockWebSocketWithReconnect.reset();
	});

	afterAll(() => {
		vi.unstubAllGlobals();
	});

	describe("Reconnection Logic", () => {
		it("should attempt reconnection when connection fails", async () => {
			const client = new WebSocketClient("ws://test.com", undefined, {
				shouldReconnect: true,
				reconnectRetryTimeout: 50,
				reconnectRetryMaxNumber: 2,
			});

			// Make first connection fail, then succeed
			MockWebSocketWithReconnect.shouldFailNext = true;

			const onErrorSpy = vi.fn();
			client.addOnErrorHandler(onErrorSpy);

			client.connect();

			// Wait for first connection to fail and reconnection to be attempted
			await new Promise((resolve) => setTimeout(resolve, 200));

			// After first failure, next connection should succeed
			MockWebSocketWithReconnect.shouldFailNext = false;

			// Should have at least 2 instances (failed + retry)
			expect(MockWebSocketWithReconnect.instances.length).toBeGreaterThan(1);
		});

		it("should stop reconnecting after max attempts", async () => {
			const client = new WebSocketClient("ws://test.com", undefined, {
				shouldReconnect: true,
				reconnectRetryTimeout: 10,
				reconnectRetryMaxNumber: 2,
			});

			// Make all connections fail
			MockWebSocketWithReconnect.shouldFailNext = true;

			client.connect();

			// Wait longer to allow for multiple reconnection attempts
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Should have attempted 2 retries + original = max 3 instances
			// But retry number should be capped at max
			expect(client.retryNumber).toBeLessThanOrEqual(2);
		});

		it("should reset retry count on successful connection", async () => {
			const client = new WebSocketClient("ws://test.com");

			// First connection should succeed immediately
			client.connect();
			await new Promise((resolve) => setTimeout(resolve, 50));

			// Retry count should be reset after successful connection
			expect(client.retryNumber).toBe(0);
		});
	});

	describe("Message Parsing", () => {
		let client: WebSocketClient;

		beforeEach(async () => {
			client = new WebSocketClient("ws://test.com", undefined, {
				parsedMessage: true,
			});
			client.connect();
			await new Promise((resolve) => setTimeout(resolve, 20));
		});

		it("should parse JSON messages when parsedMessage is true", async () => {
			const messageHandler = vi.fn();
			client.addOnMessageHandler(messageHandler);

			// Wait for connection to be established
			await new Promise((resolve) => setTimeout(resolve, 50));

			const testData = { type: "test", value: 123 };
			const sendResult = client.send(testData);

			// Ensure send was successful
			expect(sendResult).toBe(true);

			await new Promise((resolve) => setTimeout(resolve, 20));

			expect(messageHandler).toHaveBeenCalledWith(testData, expect.any(Object));
		});

		it("should handle invalid JSON gracefully", async () => {
			const messageHandler = vi.fn();
			client.addOnMessageHandler(messageHandler);

			// Wait for connection to be established
			await new Promise((resolve) => setTimeout(resolve, 50));

			// Simulate receiving invalid JSON
			const mockWs = MockWebSocketWithReconnect.getLastInstance();
			if (mockWs?.onmessage) {
				mockWs.onmessage({
					type: "message",
					data: "invalid json {",
					target: mockWs,
				} as unknown as MessageEvent);
			}

			await new Promise((resolve) => setTimeout(resolve, 20));

			expect(messageHandler).toHaveBeenCalledWith("invalid json {", expect.any(Object));
		});
	});

	describe("Debug Mode", () => {
		it("should log debug messages when debug is enabled", () => {
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			const client = new WebSocketClient("ws://test.com", undefined, {
				debug: true,
			});

			client.connect();

			// Private method access for testing
			// biome-ignore lint/suspicious/noExplicitAny: Needed for testing private method
			(client as any).debug("test", "test message", { data: "test" });
			expect(consoleSpy).toHaveBeenCalledWith("[test] test message", {
				data: "test",
			});

			consoleSpy.mockRestore();
		});

		it("should not log when debug is disabled", () => {
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			const client = new WebSocketClient("ws://test.com", undefined, {
				debug: false,
			});

			// Private method access for testing
			// biome-ignore lint/suspicious/noExplicitAny: Needed for testing private method
			(client as any).debug("test", "test message", { data: "test" });

			expect(consoleSpy).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe("Edge Cases", () => {
		it("should handle restart functionality", async () => {
			const client = new WebSocketClient("ws://test.com");
			client.connect();
			await new Promise((resolve) => setTimeout(resolve, 20));

			const initialInstanceCount = MockWebSocketWithReconnect.instances.length;

			client.restart();
			await new Promise((resolve) => setTimeout(resolve, 20));

			expect(MockWebSocketWithReconnect.instances.length).toBeGreaterThan(initialInstanceCount);
			expect(client.shouldRestart).toBe(true);
		});

		it("should handle close event properly", async () => {
			const client = new WebSocketClient("ws://test.com");
			const closeHandler = vi.fn();
			client.addOnCloseHandler(closeHandler);

			client.connect();
			await new Promise((resolve) => setTimeout(resolve, 20));

			client.close();
			await new Promise((resolve) => setTimeout(resolve, 20));

			expect(closeHandler).toHaveBeenCalled();
			expect(client.shouldClose).toBe(true);
		});

		it("should return null for utility methods when not connected", () => {
			const client = new WebSocketClient("ws://test.com");

			expect(client.getCurrentState()).toBeNull();
			expect(client.getBinaryType()).toBeNull();
			expect(client.getBufferedAmount()).toBeNull();
			expect(client.getExtensions()).toBeNull();
			expect(client.getProtocol()).toBeNull();
			expect(client.getUrl()).toBeNull();
		});
	});
});
