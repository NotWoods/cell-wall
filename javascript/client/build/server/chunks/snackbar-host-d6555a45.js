import "./cell-state-schema-b294815b.js";
import { w as writable } from "./index-23b4b723.js";
function abortSignalAny(...items) {
  const signals = items.filter((item) => item != void 0);
  if (signals.length <= 1) {
    return signals[0];
  }
  const controller = new AbortController();
  const abort = controller.abort.bind(controller);
  for (const signal of signals) {
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener("abort", abort, { once: true, signal: controller.signal });
    }
  }
  return controller.signal;
}
function setTimeoutAsync(delay, options = {}) {
  const { signal } = options;
  if (signal?.aborted) {
    return Promise.reject(new Error("AbortError"));
  }
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new Error("AbortError"));
      });
    }
  });
}
class SnackbarHostState {
  constructor() {
    this._currentSnackbarData = writable(void 0);
    this._lastSnackbar = Promise.resolve();
  }
  get currentSnackbarData() {
    return this._currentSnackbarData;
  }
  showSnackbar(message, duration = 1500, options = {}) {
    const dismissController = new AbortController();
    const snackbarData = {
      message,
      duration,
      dismiss: dismissController.abort.bind(dismissController)
    };
    const signal = abortSignalAny(dismissController.signal, options.signal);
    const snackbarPromise = this._lastSnackbar.catch(() => {
    }).then(() => {
      if (signal?.aborted)
        return;
      this._currentSnackbarData.set(snackbarData);
      return setTimeoutAsync(duration, { signal }).finally(() => {
        this._currentSnackbarData.set(void 0);
      });
    });
    this._lastSnackbar = snackbarPromise;
    return snackbarPromise;
  }
}
export { SnackbarHostState as S };
