import { c as create_ssr_component, a as subscribe, b as add_attribute, n as noop, g as getContext, s as setContext, v as validate_component } from "../../../../chunks/index-07af9b00.js";
import { r as readable } from "../../../../chunks/web-c1f4ba88.js";
import { f as frameUrl, c as connect, a as cellState } from "../../../../chunks/state-socket-9cad1e3b.js";
import { r as randomItem } from "../../../../chunks/random-ca7fbb84.js";
var SocketIndicator_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".socket-error.svelte-oss7oo{position:absolute;top:0;right:0;z-index:1}",
  map: null
};
function socketConnectionState(socket) {
  return readable("open", (set) => {
    const controller = new AbortController();
    socket == null ? void 0 : socket.addEventListener("error", () => set("error"), controller);
    socket == null ? void 0 : socket.addEventListener("close", () => set("close"), controller);
    return () => controller.abort();
  });
}
const SocketIndicator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let socketState;
  let $socketState, $$unsubscribe_socketState = noop, $$subscribe_socketState = () => ($$unsubscribe_socketState(), $$unsubscribe_socketState = subscribe(socketState, ($$value) => $socketState = $$value), socketState);
  let { socket } = $$props;
  if ($$props.socket === void 0 && $$bindings.socket && socket !== void 0)
    $$bindings.socket(socket);
  $$result.css.add(css$2);
  $$subscribe_socketState(socketState = socketConnectionState(socket));
  $$unsubscribe_socketState();
  return `${$socketState !== "open" ? `<svg class="${"socket-error svelte-oss7oo"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 24 24"}" height="${"24px"}" width="${"24px"}"${add_attribute("fill", $socketState === "error" ? "#DC2626" : "#EA580C", 0)} stroke="${"#fff"}"><path d="${"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"}"></path></svg>` : ``}`;
});
var _PageTransition_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".inner.svelte-noax5s{position:absolute;top:0;left:0}",
  map: null
};
const directions = {
  left: { x: -100, y: 0 },
  right: { x: 100, y: 0 },
  top: { x: 0, y: -100 },
  bottom: { x: 0, y: 100 }
};
const directionKeys = Object.keys(directions);
const PageTransition = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  directions[randomItem(directionKeys)];
  $$result.css.add(css$1);
  return `<div class="${"inner fill svelte-noax5s"}">${slots.default ? slots.default({}) : ``}
</div>`;
});
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".layout.svelte-12yt1eb{position:relative;height:100vh;height:100dvh;width:100vw;background:#429a46;overflow:hidden}",
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
  const socket = connect();
  const state = cellState(socket);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  setContext("frame", { socket, state });
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  $$result.css.add(css);
  frameUrl($state.type, serial);
  $$unsubscribe_state();
  return `${$$result.head += `${$$result.title = `<title>Cell</title>`, ""}`, ""}

<div class="${"layout svelte-12yt1eb"}">${validate_component(PageTransition, "PageTransition").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}</div>

${socket ? `${validate_component(SocketIndicator, "SocketIndicator").$$render($$result, { socket }, {}, {})}` : ``}`;
});
export { _layout as default, getFrameContext, load };
