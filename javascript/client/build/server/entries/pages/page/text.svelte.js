import { c as create_ssr_component, a as subscribe, e as escape } from "../../../chunks/index-50854321.js";
import { p as page } from "../../../chunks/stores-530216e4.js";
var text_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-12o3ebn{display:flex;height:100vh;align-items:center}h1.svelte-12o3ebn{margin:8px}",
  map: null
};
const router = false;
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let text;
  let backgroundColor;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  text = $page.url.searchParams.get("text") || "CellWall";
  backgroundColor = $page.url.searchParams.get("backgroundColor") || "#429A46";
  $$unsubscribe_page();
  return `<main style="${"background: " + escape(backgroundColor) + ";"}" class="${"svelte-12o3ebn"}"><h1 class="${"headline-1 svelte-12o3ebn"}">${escape(text)}</h1>
</main>`;
});
export { Text as default, router };
