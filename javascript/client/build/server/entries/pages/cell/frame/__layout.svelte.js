import { g as getContext, c as create_ssr_component, a as subscribe, s as setContext, b as add_attribute } from "../../../../chunks/index-4d214b4e.js";
import { c as cellState, f as frameUrl, a as connect } from "../../../../chunks/state-socket-c1d8cd72.js";
import "../../../../chunks/cell-state-schema-a24ecc56.js";
import "../../../../chunks/index-23b4b723.js";
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".socket-error.svelte-oss7oo{position:absolute;top:0;right:0;z-index:1}",
  map: null
};
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
  let $state, $$unsubscribe_state;
  let { serial } = $$props;
  let socketState = "open";
  const socket = connect();
  const state = cellState(socket);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  setContext("frame", { socket, state });
  socket?.addEventListener("error", () => {
    socketState = "error";
  });
  socket?.addEventListener("close", () => {
    socketState = "close";
  });
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  $$result.css.add(css);
  frameUrl($state.type, serial);
  $$unsubscribe_state();
  return `${$$result.head += `${$$result.title = `<title>Cell</title>`, ""}`, ""}

${slots.default ? slots.default({}) : ``}

${socketState !== "open" ? `<svg class="${"socket-error svelte-oss7oo"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 24 24"}" height="${"24px"}" width="${"24px"}"${add_attribute("fill", socketState === "error" ? "#DC2626" : "#EA580C", 0)} stroke="${"#fff"}"><path d="${"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"}"></path></svg>` : ``}`;
});
export { _layout as default, getFrameContext, load };
