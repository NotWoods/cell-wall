import { c as create_ssr_component, a as subscribe, b as add_attribute } from "../../../chunks/index-50854321.js";
import { r as readable, d as derived } from "../../../chunks/index-06c8ab10.js";
import "../../../chunks/state-832ea5b1.js";
function socketStore(url, defaultValue) {
  {
    return readable(defaultValue);
  }
}
var frame_svelte_svelte_type_style_lang = "";
const css = {
  code: "iframe.svelte-9qi62d{height:100vh;width:100vw}",
  map: null
};
const ws = derived(socketStore("ws://localhost:3000", "{}"), (json) => JSON.parse(json));
const load = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return {
      status: 400,
      error: new Error("Missing ID")
    };
  }
  return { props: { serial: id } };
};
const Frame = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_ws;
  $$unsubscribe_ws = subscribe(ws, (value) => value);
  let { serial } = $$props;
  let frame;
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  $$result.css.add(css);
  $$unsubscribe_ws();
  return `${$$result.head += `${$$result.title = `<title>CellWall</title>`, ""}`, ""}

<iframe title="${"Cell content"}" class="${"svelte-9qi62d"}"${add_attribute("this", frame, 0)}></iframe>`;
});
export { Frame as default, load };
