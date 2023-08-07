import { c as create_ssr_component, s as subscribe, e as escape } from './ssr-966736c7.js';
import { f as filterState } from './filter-state-e2092dbc.js';
import './web-ec6e3b01.js';
import { R as RAINBOW_COLORS } from './color-e99104bb.js';
import { r as randomItem } from './random-c2405d3d.js';
import { getFrameContext } from './_layout.svelte-bd8a7ccf.js';
import './index2-505c6d08.js';
import './state-socket-ab578445.js';

const css = {
  code: "main.svelte-cak7yr{text-align:center}h1.svelte-cak7yr{margin:8px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let text;
  let backgroundColor;
  let $textState, $$unsubscribe_textState;
  const randomDefaultColor = randomItem(RAINBOW_COLORS);
  const { state } = getFrameContext();
  const textState = filterState("TEXT", state);
  $$unsubscribe_textState = subscribe(textState, (value) => $textState = value);
  $$result.css.add(css);
  text = $textState?.payload || "";
  backgroundColor = $textState?.backgroundColor || randomDefaultColor;
  $$unsubscribe_textState();
  return `<main class="fill center svelte-cak7yr" style="${"background: " + escape(backgroundColor, true) + ";"}"><h1 class="headline-1 svelte-cak7yr">${escape(text)}</h1> </main>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-2db439b1.js.map
