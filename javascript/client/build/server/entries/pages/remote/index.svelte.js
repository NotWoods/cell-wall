import { c as create_ssr_component, e as escape, q as add_classes, v as validate_component, a as subscribe, b as add_attribute, f as each, n as noop } from "../../../chunks/index-07af9b00.js";
import { a as applyScale, s as splitToBuckets, f as fitScale } from "../../../chunks/fit-scale-9ea13e5e.js";
import { d as derived, r as readable, b as blankState, c as cellCanvas } from "../../../chunks/web-9fac8a47.js";
import startCase from "lodash.startcase";
import { g as getRemoteContext } from "../../../chunks/__layout-1916a0e9.js";
import "../../../chunks/TopBar-63a4c84b.js";
import "../../../chunks/snackbar-host-2ba8754b.js";
function resizeObserverStore(element) {
  if (element) {
    return readable(void 0, (set) => {
      const resizeObserver = new ResizeObserver((entries) => set(entries[0]));
      resizeObserver.observe(element);
      return () => resizeObserver.unobserve(element);
    });
  } else {
    return readable(void 0);
  }
}
function elementSizeStore(element) {
  return derived(resizeObserverStore(element), ($resizeObserver) => {
    if ($resizeObserver) {
      if ($resizeObserver.contentBoxSize) {
        const boxSize = $resizeObserver.contentBoxSize[0];
        return {
          width: boxSize.inlineSize,
          height: boxSize.blockSize
        };
      } else {
        const rect = $resizeObserver.contentRect;
        return {
          width: rect.width,
          height: rect.height
        };
      }
    } else {
      return void 0;
    }
  });
}
const SelectAppContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let app;
  let typeName;
  let { info } = $$props;
  let { state } = $$props;
  let { small = false } = $$props;
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  if ($$props.small === void 0 && $$bindings.small && small !== void 0)
    $$bindings.small(small);
  app = state ?? blankState;
  typeName = app.type === "BLANK" ? "Select App" : startCase(app.type.toLocaleLowerCase());
  return `<h3 class="${"text-md"}">${escape(info.deviceName || info.serial)}</h3>
<a href="${"/remote/custom?id=" + escape(info.serial)}" class="${[
    "m-auto flex items-center text-center gap-1 rounded-lg transition-colors hover:bg-slate-900",
    (!small ? "flex-col" : "") + " " + (!small ? "p-4" : "") + " " + (small ? "p-2" : "") + " " + (small ? "text-sm" : "")
  ].join(" ").trim()}"><svg viewBox="${"0 0 24 24"}" fill="${"currentColor"}"${add_classes(((!small ? "w-12" : "") + " " + (!small ? "h-12" : "") + " " + (small ? "w-6" : "") + " " + (small ? "h-6" : "")).trim())}>${app.type === "TEXT" ? `<path d="${"M2.5,4v3h5v12h3V7h5V4H2.5z M21.5,9h-9v3h3v7h3v-7h3V9z"}"></path>` : `${app.type === "IMAGE" ? `<path d="${"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"}"></path>` : `${app.type === "WEB" ? `<path d="${"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"}"></path>` : `${app.type === "CLOCK" ? `<path d="${"M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"}"></path>` : `${app.type === "BUSY" ? `<path d="${"M9.31 17l2.44-2.44L14.19 17l1.06-1.06-2.44-2.44 2.44-2.44L14.19 10l-2.44 2.44L9.31 10l-1.06 1.06 2.44 2.44-2.44 2.44L9.31 17zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"}"></path>` : `<path d="${"M2,2H11V11H2V2M17.5,2C20,2 22,4 22,6.5C22,9 20,11 17.5,11C15,11 13,9 13,6.5C13,4 15,2 17.5,2M6.5,14L11,22H2L6.5,14M19,17H22V19H19V22H17V19H14V17H17V14H19V17Z"}"></path>`}`}`}`}`}</svg>
	${escape(typeName)}</a>`;
});
const SelectAppCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rect;
  let small;
  let { info } = $$props;
  let { scale } = $$props;
  let { state } = $$props;
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  rect = applyScale(info, scale);
  small = rect.height < 150;
  return `<article class="${"bg-slate-800 p-2 border rounded border-slate-700 flex flex-col absolute box-border overflow-hidden"}" style="${"left: " + escape(rect.x) + "px; top: " + escape(rect.y) + "px; width: " + escape(rect.width) + "px; height: " + escape(rect.height) + "px;"}">${validate_component(SelectAppContent, "SelectAppContent").$$render($$result, { info, state, small }, {}, {})}</article>`;
});
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: ".grid.svelte-m2ig6y{grid-template-columns:repeat(auto-fit, minmax(200px, 1fr))}",
  map: null
};
const Remote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let elementSize;
  let buckets;
  let cellCanvasRect;
  let scale;
  let heightStyle;
  let $elementSize, $$unsubscribe_elementSize = noop, $$subscribe_elementSize = () => ($$unsubscribe_elementSize(), $$unsubscribe_elementSize = subscribe(elementSize, ($$value) => $elementSize = $$value), elementSize);
  let $remoteState, $$unsubscribe_remoteState;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  let container;
  $$result.css.add(css);
  $$subscribe_elementSize(elementSize = elementSizeStore(container));
  buckets = splitToBuckets($remoteState);
  cellCanvasRect = cellCanvas(buckets.rectWithPos);
  scale = $elementSize ? fitScale({
    width: $elementSize.width,
    height: Infinity
  }, cellCanvasRect) : 1;
  heightStyle = cellCanvasRect.height !== Infinity ? `${cellCanvasRect.height * scale}px` : "auto";
  $$unsubscribe_elementSize();
  $$unsubscribe_remoteState();
  return `<section class="${"relative"}" style="${"height: " + escape(heightStyle)}"${add_attribute("this", container, 0)}>${each(buckets.rectWithPos, (info) => {
    var _a;
    return `${validate_component(SelectAppCard, "SelectAppCard").$$render($$result, {
      info,
      scale,
      state: (_a = $remoteState.get(info.serial)) == null ? void 0 : _a.state
    }, {}, {})}`;
  })}</section>
<div class="${"grid gap-4 svelte-m2ig6y"}">${each(buckets.rect, (info) => {
    var _a;
    return `<article class="${"bg-slate-800 p-2 border rounded border-slate-700 flex flex-col box-border overflow-hidden"}">${validate_component(SelectAppContent, "SelectAppContent").$$render($$result, {
      info,
      state: (_a = $remoteState.get(info.serial)) == null ? void 0 : _a.state
    }, {}, {})}
		</article>`;
  })}
	${each(buckets.rest, (info) => {
    var _a;
    return `<article class="${"bg-slate-800 p-2 border rounded border-slate-700 flex flex-col box-border overflow-hidden"}">${validate_component(SelectAppContent, "SelectAppContent").$$render($$result, {
      info,
      state: (_a = $remoteState.get(info.serial)) == null ? void 0 : _a.state
    }, {}, {})}
		</article>`;
  })}
</div>`;
});
export { Remote as default };
