import { c as create_ssr_component, b as add_attribute, a as subscribe, v as validate_component, p as each, e as escape } from "../../../chunks/index-4d214b4e.js";
import { c as cellCanvas } from "../../../chunks/cell-state-schema-a24ecc56.js";
import { a as getRemoteContext } from "../../../chunks/__layout-9d80af09.js";
import "../../../chunks/stores-6d7f4c16.js";
import "../../../chunks/TopBar-cc586f2b.js";
import "../../../chunks/index-23b4b723.js";
import "../../../chunks/snackbar-host-a60c3b5b.js";
function isNumber(number) {
  return typeof number === "number" && !Number.isNaN(number);
}
function validRect(rect = {}) {
  return isNumber(rect.width) && isNumber(rect.height);
}
function validRectWithPos(rect = {}) {
  return isNumber(rect.x) && isNumber(rect.y) && validRect(rect);
}
var RectCanvas_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "canvas.svelte-nnt7wc{border-color:#1b5e20;background-color:#429a46}",
  map: null
};
function getScale(canvas, rects) {
  if (!canvas) {
    return 1;
  }
  const { width, height } = cellCanvas(rects);
  const widthScale = canvas.width / width;
  const heightScale = canvas.height / height;
  return Math.min(widthScale, heightScale);
}
function drawCanvas(ctx, scale, rects) {
  if (!ctx)
    return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "20px sans-serif";
  for (const info of rects) {
    const { x, y, width, height } = info;
    ctx.fillStyle = "#EFEFEF";
    ctx.fillRect(x * scale, y * scale, width * scale, height * scale);
    ctx.fillStyle = "#1b5e20";
    ctx.fillText(info.deviceName || info.serial, x * scale + 10, y * scale + 30, width * scale - 20);
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
  ctx = canvas?.getContext("2d") ?? void 0;
  scale = getScale(canvas, rects);
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
function splitToBuckets(devices) {
  const rectWithPos = [];
  const rect = [];
  const rest = [];
  for (const [serial, { info }] of devices) {
    if (!info) {
      rest.push({ serial });
      continue;
    }
    if (validRectWithPos(info)) {
      rectWithPos.push(info);
    } else if (validRect(info)) {
      rect.push(info);
    } else {
      rest.push(info);
    }
  }
  return { rectWithPos, rect, rest };
}
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
