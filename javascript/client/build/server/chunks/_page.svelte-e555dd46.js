import { c as create_ssr_component, s as subscribe, a as add_attribute } from './ssr-966736c7.js';
import { f as filterState } from './filter-state-e2092dbc.js';
import { getFrameContext } from './_layout.svelte-bd8a7ccf.js';
import './index2-505c6d08.js';
import './state-socket-ab578445.js';
import './web-ec6e3b01.js';
import './random-c2405d3d.js';

const css = {
  code: "iframe.svelte-8wym80{border:0;background:white}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let url;
  let $webState, $$unsubscribe_webState;
  const { state } = getFrameContext();
  const webState = filterState("WEB", state);
  $$unsubscribe_webState = subscribe(webState, (value) => $webState = value);
  let frame;
  $$result.css.add(css);
  url = $webState?.payload || "about:blank";
  $$unsubscribe_webState();
  return `<iframe class="fill svelte-8wym80"${add_attribute("src", url, 0)} title="Cell content"${add_attribute("this", frame, 0)}></iframe>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-e555dd46.js.map
