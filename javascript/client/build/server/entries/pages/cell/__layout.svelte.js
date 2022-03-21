import { c as create_ssr_component, a as subscribe, v as validate_component } from "../../../chunks/index-4d214b4e.js";
import { p as page } from "../../../chunks/stores-6d7f4c16.js";
var _PageTransition_svelte_svelte_type_style_lang = "";
const css = {
  code: ".layout.svelte-1kgdfam{height:100vh;height:100dvh;width:100vw;background:#429a46}",
  map: null
};
const PageTransition = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { key = "" } = $$props;
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  $$result.css.add(css);
  return `<div class="${"layout svelte-1kgdfam"}">${slots.default ? slots.default({}) : ``}</div>`;
});
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `${$$result.head += `<meta name="${"apple-mobile-web-app-capable"}" content="${"yes"}" data-svelte="svelte-s5oyw9"><meta name="${"apple-mobile-web-app-status-bar-style"}" content="${"black-translucent"}" data-svelte="svelte-s5oyw9"><meta name="${"apple-mobile-web-app-title"}" content="${"CellWall"}" data-svelte="svelte-s5oyw9"><link rel="${"apple-touch-icon"}" sizes="${"274x274"}" href="${"/maskable_icon.png"}" data-svelte="svelte-s5oyw9">`, ""}

${validate_component(PageTransition, "PageTransition").$$render($$result, { key: $page.url.pathname }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export { _layout as default };
