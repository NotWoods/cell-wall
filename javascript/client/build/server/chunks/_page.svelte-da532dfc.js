import { c as create_ssr_component, a as add_attribute } from './ssr-966736c7.js';
import { B as BROWSER } from './prod-ssr-7cc47430.js';
import { f as frameUrl } from './state-socket-ab578445.js';
import { d as derived, w as writable } from './index2-505c6d08.js';
import './web-ec6e3b01.js';

const browser = BROWSER;
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const goto = /* @__PURE__ */ client_method("goto");
const preloadCode = /* @__PURE__ */ client_method("preload_code");
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
  const { state, ...stores } = lockState();
  async function enterFullScreen() {
    try {
      await document.documentElement.requestFullscreen().then(
        () => state.set({ active: true }),
        (error) => state.set({ active: false, error })
      );
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
  document.addEventListener(
    "fullscreenchange",
    () => {
      state.set({ active: Boolean(document.fullscreenElement) });
    },
    controller
  );
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
        wakeLock.addEventListener(
          "release",
          () => {
            state.set({ active: false });
          },
          controller
        );
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
const css = {
  code: "form.svelte-1n83scs{display:flex;flex-direction:column;row-gap:1em;max-width:100vw;font-size:1.5rem}input.svelte-1n83scs,button.svelte-1n83scs{font:inherit}.buttons.svelte-1n83scs{display:flex;justify-content:space-between}button.svelte-1n83scs{padding:0.2em 1em}@media(max-width: 21rem){form.svelte-1n83scs{font-size:1rem}label.svelte-1n83scs{font-size:1.5em}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let id = data.id || "";
  async function submit() {
    localStorage.setItem("id", id);
    requestFullScreen();
    requestWakeLock();
    const routePrefetchJob = preloadCode(...Array.from(cellStateTypes, (type) => frameUrl(type, id)));
    await goto(frameUrl("BLANK", id), { replaceState: false });
    await routePrefetchJob;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  {
    {
      if (data.autoJoin && browser) {
        submit();
      }
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-1rqvp1e_START -->${$$result.title = `<title>New Cell | CellWall</title>`, ""}<!-- HEAD_svelte-1rqvp1e_END -->`, ""} <div class="fill center wrapper"><form action="/cell/frame/blank" method="get" class="svelte-1n83scs"><img src="/logo.png" alt="" width="48" height="48"> <label for="control-id" class="svelte-1n83scs" data-svelte-h="svelte-10tqeo">Cell ID</label> <input id="control-id" name="id" type="text" required class="svelte-1n83scs"${add_attribute("value", id, 0)}> <div class="buttons svelte-1n83scs"><button type="reset" class="svelte-1n83scs" data-svelte-h="svelte-1if3dms">Reset</button> <button type="submit" class="svelte-1n83scs" data-svelte-h="svelte-19tnfmz">Join</button></div></form> </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-da532dfc.js.map
