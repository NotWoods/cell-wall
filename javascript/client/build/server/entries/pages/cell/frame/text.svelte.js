import { c as create_ssr_component, a as subscribe, e as escape, n as noop } from "../../../../chunks/index-07af9b00.js";
import { f as filterState } from "../../../../chunks/filter-state-644ea021.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/web-c1f4ba88.js";
import "../../../../chunks/state-socket-9cad1e3b.js";
import "../../../../chunks/random-ca7fbb84.js";
var text_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-cak7yr{text-align:center}h1.svelte-cak7yr{margin:8px}",
  map: null
};
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let textState;
  let text;
  let backgroundColor;
  let $textState, $$unsubscribe_textState = noop, $$subscribe_textState = () => ($$unsubscribe_textState(), $$unsubscribe_textState = subscribe(textState, ($$value) => $textState = $$value), textState);
  const { state } = getFrameContext();
  $$result.css.add(css);
  $$subscribe_textState(textState = filterState("TEXT", state));
  text = ($textState == null ? void 0 : $textState.payload) || "CellWall";
  backgroundColor = ($textState == null ? void 0 : $textState.backgroundColor) || "#429A46";
  $$unsubscribe_textState();
  return `<main class="${"fill center svelte-cak7yr"}" style="${"background: " + escape(backgroundColor) + ";"}"><h1 class="${"headline-1 svelte-cak7yr"}">${escape(text)}</h1>
</main>`;
});
export { Text as default };