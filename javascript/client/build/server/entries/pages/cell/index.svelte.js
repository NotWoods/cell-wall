import { c as create_ssr_component, b as add_attribute } from "../../../chunks/index-4d214b4e.js";
import { f as frameUrl } from "../../../chunks/state-socket-c1d8cd72.js";
import { d as derived, w as writable } from "../../../chunks/index-23b4b723.js";
import "../../../chunks/cell-state-schema-a24ecc56.js";
import { c as cellStateTypes } from "../../../chunks/index-60355bff.js";
const browser = false;
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const goto = guard("goto");
const prefetchRoutes = guard("prefetchRoutes");
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
  const { state, ...stores } = lockState();
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
  return {
    ...stores,
    async release() {
      controller.abort();
      await document.exitFullscreen();
    }
  };
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
    const { state, ...stores } = lockState();
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
    return {
      ...stores,
      async release() {
        controller.abort();
        await wakeLock?.release();
      }
    };
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
