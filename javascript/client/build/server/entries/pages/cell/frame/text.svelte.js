import { c as create_ssr_component, a as subscribe, e as escape } from "../../../../chunks/index-0b76d127.js";
import "../../../../chunks/web-9961d8d9.js";
import { f as filterState } from "../../../../chunks/index-cc0f756b.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-81af6fa4.js";
import "../../../../chunks/index-441a7cba.js";
var text_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-cak7yr{text-align:center}h1.svelte-cak7yr{margin:8px}",
  map: null
};
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let textState;
  let text;
  let backgroundColor;
  let $state, $$unsubscribe_state;
  const { state } = getFrameContext();
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  $$result.css.add(css);
  textState = filterState("TEXT", $state);
  text = (textState == null ? void 0 : textState.payload) || "CellWall";
  backgroundColor = (textState == null ? void 0 : textState.backgroundColor) || "#429A46";
  $$unsubscribe_state();
  return `<main class="${"fill center svelte-cak7yr"}" style="${"background: " + escape(backgroundColor) + ";"}"><h1 class="${"headline-1 svelte-cak7yr"}">${escape(text)}</h1>
</main>`;
});
export { Text as default };
