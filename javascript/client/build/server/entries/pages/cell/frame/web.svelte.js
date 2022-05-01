import { c as create_ssr_component, a as subscribe, b as add_attribute } from "../../../../chunks/index-0b76d127.js";
import "../../../../chunks/web-9961d8d9.js";
import { f as filterState } from "../../../../chunks/index-cc0f756b.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-81af6fa4.js";
import "../../../../chunks/index-441a7cba.js";
var web_svelte_svelte_type_style_lang = "";
const css = {
  code: "iframe.svelte-8wym80{border:0;background:white}",
  map: null
};
const Web = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let webState;
  let url;
  let $state, $$unsubscribe_state;
  const { state } = getFrameContext();
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  let frame;
  $$result.css.add(css);
  webState = filterState("WEB", $state);
  url = (webState == null ? void 0 : webState.payload) || "about:blank";
  $$unsubscribe_state();
  return `<iframe class="${"fill svelte-8wym80"}"${add_attribute("src", url, 0)} title="${"Cell content"}"${add_attribute("this", frame, 0)}></iframe>`;
});
export { Web as default };
