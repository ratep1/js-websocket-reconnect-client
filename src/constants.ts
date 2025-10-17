const STATES: { [key: number]: string } = {
	0: "CONNECTING",
	1: "OPEN",
	2: "CLOSING",
	3: "CLOSED",
};

const BINARY_TYPES: { [key: string]: string } = {
	blob: "blob",
	arraybuffer: "arraybuffer",
};

export { BINARY_TYPES, STATES };
