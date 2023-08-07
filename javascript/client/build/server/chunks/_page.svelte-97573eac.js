import { c as create_ssr_component, k as compute_rest_props, l as spread, m as escape_object, p as escape_attribute_value, e as escape, s as subscribe, v as validate_component, f as each, a as add_attribute } from './ssr-966736c7.js';
import { s as splitToBuckets, a as applyScale } from './fit-scale-333a67b3.js';
import { c as cellCanvas } from './web-ec6e3b01.js';
import { g as getRemoteContext } from './_layout.svelte-669347b1.js';
import './stores-1982239f.js';
import './TopBar-debc3b53.js';
import './index2-505c6d08.js';

const LinkButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["href", "class"]);
  let { href } = $$props;
  let { class: className = "bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<a${spread(
    [
      escape_object($$restProps),
      { href: escape_attribute_value(href) },
      {
        class: "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors " + escape(className, true)
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</a>`;
});

const css$1 = {
  code: "canvas.svelte-nnt7wc{border-color:#1b5e20;background-color:#429a46}",
  map: null
};
function drawCanvas(ctx, scale, rects) {
  if (!ctx)
    return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "20px sans-serif";
  for (const info of rects) {
    const { x, y, width, height } = applyScale(info, scale);
    ctx.fillStyle = "#EFEFEF";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#1b5e20";
    ctx.fillText(info.deviceName || info.serial, x + 10, y + 30, width - 20);
  }
}
const RectCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ctx;
  let scale;
  let { rects = [] } = $$props;
  let canvas;
  if ($$props.rects === void 0 && $$bindings.rects && rects !== void 0)
    $$bindings.rects(rects);
  $$result.css.add(css$1);
  ctx = void 0;
  cellCanvas(rects);
  scale = 1;
  {
    {
      drawCanvas(ctx, scale, rects);
    }
  }
  return `<canvas class="fill shadow shadow-green-900 rounded-lg border-8 svelte-nnt7wc" height="700" width="1200"${add_attribute("this", canvas, 0)}></canvas>`;
});
const css = {
  code: "aside.svelte-1htb5k2{display:grid;grid-template-columns:1fr 1fr}dt.svelte-1htb5k2,dd.svelte-1htb5k2{display:inline}dt.svelte-1htb5k2::before,li.svelte-1htb5k2::before{content:'- '}dt.svelte-1htb5k2::after{content:': '}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let buckets;
  let $remoteState, $$unsubscribe_remoteState;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  $$result.css.add(css);
  buckets = splitToBuckets($remoteState);
  $$unsubscribe_remoteState();
  return `${$$result.head += `<!-- HEAD_svelte-p288z0_START -->${$$result.title = `<title>Canvas | CellWall</title>`, ""}<!-- HEAD_svelte-p288z0_END -->`, ""} <section class="fill">${validate_component(RectCanvas, "RectCanvas").$$render($$result, { rects: buckets.rectWithPos }, {}, {})} <div>${validate_component(LinkButton, "LinkButton").$$render($$result, { href: "/remote/edit" }, {}, {
    default: () => {
      return `Edit Cells`;
    }
  })}</div> <aside class="mt-4 svelte-1htb5k2"><div><h2 class="font-bold" data-svelte-h="svelte-f17jzt">No X/Y</h2> <dl>${each(buckets.rect, (info) => {
    return `<div><dt class="svelte-1htb5k2">${escape(info.serial)}</dt> <dd class="svelte-1htb5k2">${escape(info.width)} x ${escape(info.height)}</dd> </div>`;
  })}</dl></div> <div><h2 class="font-bold" data-svelte-h="svelte-13insrr">No width/height</h2> <ul>${each(buckets.rest, (info) => {
    return `<li class="svelte-1htb5k2">${escape(info.serial)}</li>`;
  })}</ul></div></aside> </section>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-97573eac.js.map
