import { c as create_ssr_component, b as add_attribute, a as subscribe, v as validate_component, f as each, e as escape } from "../../../chunks/index-07af9b00.js";
import { a as applyScale, s as splitToBuckets } from "../../../chunks/fit-scale-9ea13e5e.js";
import { L as LinkButton } from "../../../chunks/LinkButton-5c850a00.js";
import { c as cellCanvas } from "../../../chunks/web-9fac8a47.js";
import { g as getRemoteContext } from "../../../chunks/__layout-1916a0e9.js";
import "../../../chunks/TopBar-63a4c84b.js";
import "../../../chunks/snackbar-host-2ba8754b.js";
var RectCanvas_svelte_svelte_type_style_lang = "";
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
  ctx = (canvas == null ? void 0 : canvas.getContext("2d")) ?? void 0;
  cellCanvas(rects);
  scale = 1;
  {
    {
      drawCanvas(ctx, scale, rects);
    }
  }
  return `<canvas class="${"fill shadow shadow-green-900 rounded-lg border-8 svelte-nnt7wc"}" height="${"700"}" width="${"1200"}"${add_attribute("this", canvas, 0)}></canvas>`;
});
var canvas_svelte_svelte_type_style_lang = "";
const css = {
  code: "aside.svelte-1htb5k2{display:grid;grid-template-columns:1fr 1fr}dt.svelte-1htb5k2,dd.svelte-1htb5k2{display:inline}dt.svelte-1htb5k2::before,li.svelte-1htb5k2::before{content:'- '}dt.svelte-1htb5k2::after{content:': '}",
  map: null
};
const Canvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let buckets;
  let $remoteState, $$unsubscribe_remoteState;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  $$result.css.add(css);
  buckets = splitToBuckets($remoteState);
  $$unsubscribe_remoteState();
  return `${$$result.head += `${$$result.title = `<title>Canvas | CellWall</title>`, ""}`, ""}

<section class="${"fill"}">${validate_component(RectCanvas, "RectCanvas").$$render($$result, { rects: buckets.rectWithPos }, {}, {})}
	<div>${validate_component(LinkButton, "LinkButton").$$render($$result, { href: "/remote/edit" }, {}, {
    default: () => {
      return `Edit Cells`;
    }
  })}</div>
	<aside class="${"mt-4 svelte-1htb5k2"}"><div><h2 class="${"font-bold"}">No X/Y</h2>
			<dl>${each(buckets.rect, (info) => {
    return `<div><dt class="${"svelte-1htb5k2"}">${escape(info.serial)}</dt>
						<dd class="${"svelte-1htb5k2"}">${escape(info.width)} x ${escape(info.height)}</dd>
					</div>`;
  })}</dl></div>
		<div><h2 class="${"font-bold"}">No width/height</h2>
			<ul>${each(buckets.rest, (info) => {
    return `<li class="${"svelte-1htb5k2"}">${escape(info.serial)}</li>`;
  })}</ul></div></aside>
</section>`;
});
export { Canvas as default };
