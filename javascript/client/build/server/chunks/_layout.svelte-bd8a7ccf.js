import { c as create_ssr_component, s as subscribe, d as setContext, v as validate_component, g as getContext, a as add_attribute, n as noop } from './ssr-966736c7.js';
import { r as readable } from './index2-505c6d08.js';
import { c as connect, a as cellState, f as frameUrl } from './state-socket-ab578445.js';
import './web-ec6e3b01.js';
import { r as randomItem } from './random-c2405d3d.js';

const css$2 = {
  code: ".socket-error.svelte-oss7oo{position:absolute;top:0;right:0;z-index:1}",
  map: null
};
function socketConnectionState(socket) {
  return readable("open", (set) => {
    const controller = new AbortController();
    socket?.addEventListener("error", () => set("error"), controller);
    socket?.addEventListener("close", () => set("close"), controller);
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
  return `${$socketState !== "open" ? `<svg class="socket-error svelte-oss7oo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px"${add_attribute("fill", $socketState === "error" ? "#DC2626" : "#EA580C", 0)} stroke="#fff"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>` : ``}`;
});
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
  return `<div class="inner fill svelte-noax5s">${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: ".layout.svelte-12yt1eb{position:relative;height:100vh;height:100dvh;width:100vw;background:#429a46;overflow:hidden}",
  map: null
};
function getFrameContext() {
  return getContext("frame");
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $state, $$unsubscribe_state;
  let { data } = $$props;
  const socket = connect(data.serial);
  const state = cellState(socket);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  setContext("frame", { socket, state });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  frameUrl($state.type, data.serial);
  $$unsubscribe_state();
  return `${$$result.head += `<!-- HEAD_svelte-al2hjo_START -->${$$result.title = `<title>Cell</title>`, ""}<!-- HEAD_svelte-al2hjo_END -->`, ""} <div class="layout svelte-12yt1eb">${validate_component(PageTransition, "PageTransition").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}</div> ${socket ? `${validate_component(SocketIndicator, "SocketIndicator").$$render($$result, { socket }, {}, {})}` : ``}`;
});

export { Layout as default, getFrameContext };
//# sourceMappingURL=_layout.svelte-bd8a7ccf.js.map
