import { BINARY_TYPES, STATES } from "../constants";

describe("Constants", () => {
	describe("STATES", () => {
		it("should have correct WebSocket state mappings", () => {
			expect(STATES[0]).toBe("CONNECTING");
			expect(STATES[1]).toBe("OPEN");
			expect(STATES[2]).toBe("CLOSING");
			expect(STATES[3]).toBe("CLOSED");
		});

		it("should match WebSocket constants", () => {
			expect(STATES[WebSocket.CONNECTING]).toBe("CONNECTING");
			expect(STATES[WebSocket.OPEN]).toBe("OPEN");
			expect(STATES[WebSocket.CLOSING]).toBe("CLOSING");
			expect(STATES[WebSocket.CLOSED]).toBe("CLOSED");
		});

		it("should have exactly 4 states", () => {
			expect(Object.keys(STATES)).toHaveLength(4);
		});
	});

	describe("BINARY_TYPES", () => {
		it("should have correct binary type mappings", () => {
			expect(BINARY_TYPES.blob).toBe("blob");
			expect(BINARY_TYPES.arraybuffer).toBe("arraybuffer");
		});

		it("should have exactly 2 binary types", () => {
			expect(Object.keys(BINARY_TYPES)).toHaveLength(2);
		});
	});
});
