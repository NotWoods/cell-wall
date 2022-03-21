import { c as create_ssr_component, a as subscribe, e as escape } from "../../../../chunks/index-4d214b4e.js";
import "../../../../chunks/cell-state-schema-a24ecc56.js";
import { f as filterState } from "../../../../chunks/index-60355bff.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-c1d8cd72.js";
import "../../../../chunks/index-23b4b723.js";
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
  text = textState?.payload || "CellWall";
  backgroundColor = textState?.backgroundColor || "#429A46";
  $$unsubscribe_state();
  return `<main class="${"fill center svelte-cak7yr"}" style="${"background: " + escape(backgroundColor) + ";"}"><h1 class="${"headline-1 svelte-cak7yr"}">${escape(text)}</h1>
</main>`;
});
export { Text as default };
