var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { c as create_ssr_component, b as add_attribute } from "../../../chunks/index-07af9b00.js";
import { f as frameUrl } from "../../../chunks/state-socket-c39d2efa.js";
import { d as derived, w as writable } from "../../../chunks/web-9fac8a47.js";
const browser = false;
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const goto = guard("goto");
const prefetchRoutes = guard("prefetchRoutes");
const cellStateTypes = /* @__PURE__ */ new Set([
  "BLANK",
  "TEXT",
  "IMAGE",
  "WEB",
  "CLOCK",
  "BUSY"
]);
function lockState() {
  const state = writable({
    active: false
  });
  return {
    state,
    active: derived(state, ($state) => $state.active),
    error: derived(state, ($state) => $state.error)
  };
}
function requestFullScreen() {
  const controller = new AbortController();
  const _a = lockState(), { state } = _a, stores = __objRest(_a, ["state"]);
  async function enterFullScreen() {
    try {
      await document.documentElement.requestFullscreen().then(() => state.set({ active: true }), (error) => state.set({ active: false, error }));
      state.set({ active: true });
    } catch (error) {
      if (error instanceof Error) {
        state.set({ active: false, error });
      } else {
        throw error;
      }
    }
  }
  enterFullScreen();
  document.addEventListener("fullscreenchange", () => {
    state.set({ active: Boolean(document.fullscreenElement) });
  }, controller);
  return __spreadProps(__spreadValues({}, stores), {
    async release() {
      controller.abort();
      await document.exitFullscreen();
    }
  });
}
function requestWakeLock() {
  if ("wakeLock" in navigator) {
    let handleVisiblityChange = function() {
      if (wakeLock !== null && document.visibilityState === "visible") {
        requestNewLock();
      }
    };
    const controller = new AbortController();
    let wakeLock;
    const _a = lockState(), { state } = _a, stores = __objRest(_a, ["state"]);
    async function requestNewLock() {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
        state.set({ active: true });
        wakeLock.addEventListener("release", () => {
          state.set({ active: false });
        }, controller);
      } catch (error) {
        if (error instanceof DOMException) {
          state.set({ active: false, error });
        } else {
          throw error;
        }
      }
    }
    requestNewLock();
    document.addEventListener("visibilitychange", handleVisiblityChange, controller);
    document.addEventListener("fullscreenchange", handleVisiblityChange, controller);
    return __spreadProps(__spreadValues({}, stores), {
      async release() {
        controller.abort();
        await (wakeLock == null ? void 0 : wakeLock.release());
      }
    });
  } else {
    return void 0;
  }
}
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: "form.svelte-1n83scs{display:flex;flex-direction:column;row-gap:1em;max-width:100vw;font-size:1.5rem}input.svelte-1n83scs,button.svelte-1n83scs{font:inherit}.buttons.svelte-1n83scs{display:flex;justify-content:space-between}button.svelte-1n83scs{padding:0.2em 1em}@media(max-width: 21rem){form.svelte-1n83scs{font-size:1rem}label.svelte-1n83scs{font-size:1.5em}}",
  map: null
};
const load = async ({ url }) => {
  return {
    props: {
      id: url.searchParams.get("id") || "",
      autoJoin: url.searchParams.has("autojoin")
    }
  };
};
const Cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { autoJoin = false } = $$props;
  async function submit() {
    localStorage.setItem("id", id);
    requestFullScreen();
    requestWakeLock();
    const routePrefetchJob = prefetchRoutes(Array.from(cellStateTypes, (type) => frameUrl(type, id)));
    await goto(frameUrl("BLANK", id), { replaceState: false });
    await routePrefetchJob;
  }
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.autoJoin === void 0 && $$bindings.autoJoin && autoJoin !== void 0)
    $$bindings.autoJoin(autoJoin);
  $$result.css.add(css);
  {
    {
      if (autoJoin && browser) {
        submit();
      }
    }
  }
  return `${$$result.head += `${$$result.title = `<title>New Cell | CellWall</title>`, ""}`, ""}

<div class="${"fill center wrapper"}"><form action="${"/cell/frame/blank"}" method="${"get"}" class="${"svelte-1n83scs"}"><img src="${"/logo.png"}" alt="${""}" width="${"48"}" height="${"48"}">

		<label for="${"control-id"}" class="${"svelte-1n83scs"}">Cell ID</label>
		<input id="${"control-id"}" name="${"id"}" type="${"text"}" required class="${"svelte-1n83scs"}"${add_attribute("value", id, 0)}>

		<div class="${"buttons svelte-1n83scs"}"><button type="${"reset"}" class="${"svelte-1n83scs"}">Reset</button>
			<button type="${"submit"}" class="${"svelte-1n83scs"}">Join</button></div></form>
</div>`;
});
export { Cell as default, load };
