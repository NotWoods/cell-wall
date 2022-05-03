import { c as create_ssr_component, a as subscribe, b as add_attribute, n as noop } from "../../../../chunks/index-07af9b00.js";
import { f as filterState } from "../../../../chunks/filter-state-522a709a.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/web-9fac8a47.js";
import "../../../../chunks/state-socket-c39d2efa.js";
import "../../../../chunks/random-ca7fbb84.js";
var web_svelte_svelte_type_style_lang = "";
const css = {
  code: "iframe.svelte-8wym80{border:0;background:white}",
  map: null
};
const Web = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let webState;
  let url;
  let $webState, $$unsubscribe_webState = noop, $$subscribe_webState = () => ($$unsubscribe_webState(), $$unsubscribe_webState = subscribe(webState, ($$value) => $webState = $$value), webState);
  const { state } = getFrameContext();
  let frame;
  $$result.css.add(css);
  $$subscribe_webState(webState = filterState("WEB", state));
  url = ($webState == null ? void 0 : $webState.payload) || "about:blank";
  $$unsubscribe_webState();
  return `<iframe class="${"fill svelte-8wym80"}"${add_attribute("src", url, 0)} title="${"Cell content"}"${add_attribute("this", frame, 0)}></iframe>`;
});
export { Web as default };
