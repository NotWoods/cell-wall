import { c as create_ssr_component, g as getContext, a as subscribe, s as setContext, v as validate_component } from "../../../../chunks/index-4d214b4e.js";
import { b as blankState } from "../../../../chunks/cell-state-schema-a24ecc56.js";
import { r as readable } from "../../../../chunks/index-23b4b723.js";
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
var _PageTransition_svelte_svelte_type_style_lang = "";
const css = {
  code: ".layout.svelte-e2gi4i{height:100vh;height:100dvh;width:100vw}",
  map: null
};
const PageTransition = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { key = "" } = $$props;
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  $$result.css.add(css);
  return `<div class="${"layout svelte-e2gi4i"}">${slots.default ? slots.default({}) : ``}</div>`;
});
function getFrameContext() {
  return getContext("frame");
}
const load = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return {
      status: 400,
      error: new Error("Missing ID")
    };
  }
  return { props: { serial: id } };
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let url;
  let $state, $$unsubscribe_state;
  let { serial } = $$props;
  const socket = connect();
  const state = cellState(socket);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  setContext("frame", { socket, state });
  socket?.addEventListener("error", (event) => console.error("Socket error", event));
  socket?.addEventListener("open", (event) => console.info("Socket open", event));
  socket?.addEventListener("close", (event) => console.info("Socket close", event));
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  url = `/cell/frame/${$state.type.toLowerCase()}`;
  {
    {
      console.log("CellState", $state);
    }
  }
  $$unsubscribe_state();
  return `${$$result.head += `${$$result.title = `<title>Cell</title>`, ""}`, ""}

${validate_component(PageTransition, "PageTransition").$$render($$result, { key: url }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export { _layout as default, getFrameContext, load };
