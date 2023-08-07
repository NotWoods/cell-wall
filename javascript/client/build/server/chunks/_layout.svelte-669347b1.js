import { c as create_ssr_component, d as setContext, s as subscribe, v as validate_component, g as getContext, a as add_attribute, e as escape } from './ssr-966736c7.js';
import { n as navigating } from './stores-1982239f.js';
import { T as TopBar, R as RemoteFrame } from './TopBar-debc3b53.js';
import { w as writable, r as readable, d as derived } from './index2-505c6d08.js';
import './web-ec6e3b01.js';

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
class SnackbarHostState {
  _currentSnackbarData = writable(void 0);
  _lastSnackbar = Promise.resolve();
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

const css = {
  code: ".progress-bar-value.svelte-7f51jt{transform-origin:0% 50%;animation:svelte-7f51jt-indeterminateAnimation 1s infinite linear}@keyframes svelte-7f51jt-indeterminateAnimation{0%{transform:translateX(0) scaleX(0)}40%{transform:translateX(0) scaleX(0.4)}100%{transform:translateX(100%) scaleX(0.5)}}",
  map: null
};
const NavigationProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  $$result.css.add(css);
  $$unsubscribe_navigating();
  return `${$navigating != null ? `<div class="absolute w-full h-1 bg-green-900 overflow-hidden" role="progressbar"${add_attribute("aria-valuemin", 0, 0)}${add_attribute("aria-valuemax", 1, 0)} aria-valuetext="${"Loading " + escape($navigating?.to?.url.pathname, true)}"><div class="progress-bar-value w-full h-full bg-gray-200 svelte-7f51jt"></div></div>` : ``}`;
});
const Snackbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${data ? `<aside role="alert" class="fixed inset-4 top-auto bg-gray-200 text-black mx-auto px-4 py-2 max-w-lg"><button type="button" class="rounded-md float-right text-gray-600 hover:text-black" title="Dismiss snackbar" data-svelte-h="svelte-1osiuh9"><span class="sr-only">Dismiss snackbar</span> <svg class="h-6 w-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button> ${escape(data.message)}</aside>` : ``}`;
});
function connectRemote() {
  {
    return void 0;
  }
}
function remoteState(socket) {
  return readable(/* @__PURE__ */ new Map(), (set) => {
    const controller = new AbortController();
    function handleMessage({ data }) {
      const cellData = JSON.parse(data);
      const cellMap = new Map(Object.entries(cellData));
      set(cellMap);
    }
    socket?.addEventListener("message", handleMessage, controller);
    return () => controller.abort();
  });
}
function storeEntries(store) {
  return derived(store, (map) => Array.from(map.entries()));
}
function storeKeys(store) {
  return derived(store, (map) => Array.from(map.keys()));
}
function getRemoteContext() {
  return getContext("remote");
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentSnackbarData, $$unsubscribe_currentSnackbarData;
  const socket = connectRemote();
  const state = remoteState(socket);
  setContext("remote", { socket, state });
  const snackbarHostState = new SnackbarHostState();
  const { currentSnackbarData } = snackbarHostState;
  $$unsubscribe_currentSnackbarData = subscribe(currentSnackbarData, (value) => $currentSnackbarData = value);
  setContext(SnackbarHostState, snackbarHostState);
  socket?.addEventListener("error", (event) => {
    console.error("RemoteSocket error", event);
    snackbarHostState.showSnackbar("Remote socket error");
  });
  socket?.addEventListener("open", (event) => console.info("RemoteSocket open", event));
  socket?.addEventListener("close", (event) => console.info("RemoteSocket close", event));
  $$unsubscribe_currentSnackbarData();
  return `${$$result.head += `<!-- HEAD_svelte-1tkg7m6_START -->${$$result.title = `<title>CellWall Remote</title>`, ""}<link rel="manifest" href="/manifest.webmanifest"><!-- HEAD_svelte-1tkg7m6_END -->`, ""} ${validate_component(NavigationProgress, "NavigationProgress").$$render($$result, {}, {}, {})} ${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})} ${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })} ${validate_component(Snackbar, "Snackbar").$$render($$result, { data: $currentSnackbarData }, {}, {})}`;
});

var _layout_svelte = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: Layout,
  getRemoteContext: getRemoteContext
});

export { SnackbarHostState as S, _layout_svelte as _, storeKeys as a, getRemoteContext as g, storeEntries as s };
//# sourceMappingURL=_layout.svelte-669347b1.js.map
