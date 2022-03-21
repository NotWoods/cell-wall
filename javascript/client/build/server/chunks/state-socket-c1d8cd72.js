import { b as blankState } from "./cell-state-schema-a24ecc56.js";
import { r as readable } from "./index-23b4b723.js";
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
function cellState(socket) {
  let receivedState = blankState;
  return readable(blankState, (set) => {
    const controller = new AbortController();
    function handleMessage({ data }) {
      if (typeof data === "string") {
        const maybeJson = JSON.parse(data);
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
    socket?.addEventListener("message", handleMessage, controller);
    return () => controller.abort();
  });
}
function frameUrl(type, serial) {
  return `/cell/frame/${type.toLowerCase()}?id=${serial}`;
}
export { connect as a, cellState as c, frameUrl as f };
