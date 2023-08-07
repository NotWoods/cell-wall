import { c as create_ssr_component, v as validate_component, f as each, e as escape, a as add_attribute } from './ssr-966736c7.js';
import { T as TopBar, R as RemoteFrame } from './TopBar-debc3b53.js';
import './stores-1982239f.js';

const css = {
  code: ".demo-wall.svelte-e6vggo{display:grid;height:50rem;width:60rem;gap:1rem;grid-template:'demo1 demo2' 2fr\r\n			'demo1 demo3' 2fr\r\n			'demo4 demo4' 3fr\r\n			/ 1fr 2fr}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const demoEntries = ["demo1", "demo2", "demo3", "demo4"];
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-14mb5lt_START -->${$$result.title = `<title>CellWall Demo</title>`, ""}<!-- HEAD_svelte-14mb5lt_END -->`, ""} ${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})} ${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, { fullWidth: true }, {}, {
    default: () => {
      return `<div class="demo-wall mx-auto svelte-e6vggo">${each(demoEntries, (id) => {
        return `<iframe class="demo-cell shadow-lg bg-zinc-900 h-full w-full" src="${"/cell?id=" + escape(id, true) + "&autojoin"}"${add_attribute("title", id, 0)} allow="fullscreen 'none'" style="${"grid-area: " + escape(id, true)}"></iframe>`;
      })}</div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-8cf72435.js.map
