const STATES = {
	0: "CONNECTING",
	1: "OPEN",
	2: "CLOSING",
	3: "CLOSED",
} as const;

const BINARY_TYPES = {
	blob: "blob",
	arraybuffer: "arraybuffer",
} as const;

export { BINARY_TYPES, STATES };
