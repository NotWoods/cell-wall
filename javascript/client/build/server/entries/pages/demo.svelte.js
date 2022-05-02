import { c as create_ssr_component, v as validate_component, f as each, e as escape, b as add_attribute } from "../../chunks/index-07af9b00.js";
import { T as TopBar, R as RemoteFrame } from "../../chunks/TopBar-63a4c84b.js";
var demo_svelte_svelte_type_style_lang = "";
const css = {
  code: ".demo-wall.svelte-e6vggo{display:grid;height:50rem;width:60rem;gap:1rem;grid-template:'demo1 demo2' 2fr\n			'demo1 demo3' 2fr\n			'demo4 demo4' 3fr\n			/ 1fr 2fr}",
  map: null
};
const Demo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let demoEntries = ["demo1", "demo2", "demo3", "demo4"];
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>CellWall Demo</title>`, ""}`, ""}

${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})}
${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, { fullWidth: true }, {}, {
    default: () => {
      return `<div class="${"demo-wall mx-auto svelte-e6vggo"}">${each(demoEntries, (id) => {
        return `<iframe class="${"demo-cell shadow-lg bg-zinc-900 h-full w-full"}" src="${"/cell?id=" + escape(id) + "&autojoin"}"${add_attribute("title", id, 0)} allow="${"fullscreen 'none'"}" style="${"grid-area: " + escape(id)}"></iframe>`;
      })}</div>`;
    }
  })}`;
});
export { Demo as default };
