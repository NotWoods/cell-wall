import { c as create_ssr_component, a as subscribe, b as add_attribute } from "../../../../chunks/index-4d214b4e.js";
import "../../../../chunks/cell-state-schema-a24ecc56.js";
import { f as filterState } from "../../../../chunks/index-31161e5d.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/index-23b4b723.js";
var web_svelte_svelte_type_style_lang = "";
const css = {
  code: "iframe.svelte-znqehi{border:0}",
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
  {
    {
      console.log($state, $state.type, webState);
    }
  }
  url = webState?.payload || "about:blank";
  $$unsubscribe_state();
  return `<iframe class="${"fill svelte-znqehi"}"${add_attribute("src", url, 0)} title="${"Cell content"}"${add_attribute("this", frame, 0)}></iframe>`;
});
export { Web as default };
