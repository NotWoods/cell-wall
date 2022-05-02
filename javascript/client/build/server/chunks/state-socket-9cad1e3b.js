import { r as readable, b as blankState } from "./web-c1f4ba88.js";
function connect(serial) {
  {
    return void 0;
  }
}
function isCellState(state) {
  return Boolean(state && typeof state === "object" && "type" in state);
}
function emptyData(data) {
  if (data instanceof ArrayBuffer) {
    return data.byteLength === 0;
  } else if (data instanceof Blob) {
    return data.size === 0;
  }
  return false;
}
function jsonParse(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return void 0;
    }
    throw error;
  }
}
function cellState(socket) {
  let receivedState = blankState;
  return readable(blankState, (set) => {
    const controller = new AbortController();
    function handleMessage({ data }) {
      if (typeof data === "string") {
        const maybeJson = jsonParse(data);
        if (isCellState(maybeJson)) {
          receivedState = maybeJson;
          return;
        }
      }
      if (!emptyData(data)) {
        receivedState.payload = data;
      }
      set(receivedState);
    }
    socket == null ? void 0 : socket.addEventListener("message", handleMessage, controller);
    return () => controller.abort();
  });
}
function frameUrl(type, serial) {
  return `/cell/frame/${type.toLowerCase()}?id=${serial}`;
}
export { cellState as a, connect as c, frameUrl as f };
