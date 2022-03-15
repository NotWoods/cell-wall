import { c as create_ssr_component, a as subscribe, e as escape } from "../../../../chunks/index-4d214b4e.js";
import { f as filterState } from "../../../../chunks/index-038ff170.js";
import "../../../../chunks/schema-7c735d14.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/index-23b4b723.js";
var text_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-1xuwf3b{display:flex;height:100%;align-items:center;justify-content:center;text-align:center}h1.svelte-1xuwf3b{margin:8px}",
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
  return `<main style="${"background: " + escape(backgroundColor) + ";"}" class="${"svelte-1xuwf3b"}"><h1 class="${"headline-1 svelte-1xuwf3b"}">${escape(text)}</h1>
</main>`;
});
export { Text as default };
