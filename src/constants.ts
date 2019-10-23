const STATES: { [key: number]: string } = {
  1: "CONNECTING",
  2: "OPEN",
  3: "CLOSING",
  4: "CLOSED"
};

const BINARY_TYPES: { [key: string]: string } = {
  blob: "blob",
  arraybuffer: "arraybuffer"
};

export { BINARY_TYPES, STATES };
