import { c as create_ssr_component, a as subscribe, b as add_attribute } from "../../../../chunks/index-4d214b4e.js";
import "../../../../chunks/cell-state-schema-a24ecc56.js";
import { f as filterState } from "../../../../chunks/index-60355bff.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-c1d8cd72.js";
import "../../../../chunks/index-23b4b723.js";
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
  url = webState?.payload || "about:blank";
  $$unsubscribe_state();
  return `<iframe class="${"fill svelte-8wym80"}"${add_attribute("src", url, 0)} title="${"Cell content"}"${add_attribute("this", frame, 0)}></iframe>`;
});
export { Web as default };
