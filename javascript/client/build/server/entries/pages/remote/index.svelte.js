import { c as create_ssr_component, e as escape, p as add_classes, a as subscribe, b as add_attribute, f as each, n as noop, v as validate_component } from "../../../chunks/index-0b76d127.js";
import { a as applyScale, s as splitToBuckets, f as fitScale } from "../../../chunks/fit-scale-8174d2ad.js";
import { d as derived, r as readable } from "../../../chunks/index-441a7cba.js";
import { c as cellCanvas } from "../../../chunks/web-9961d8d9.js";
import { g as getRemoteContext } from "../../../chunks/__layout-8f35b6a8.js";
import "../../../chunks/TopBar-a3c8c5c4.js";
import "../../../chunks/snackbar-host-fe054673.js";
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
const SelectAppCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rect;
  let small;
  let { info } = $$props;
  let { scale } = $$props;
  let { app } = $$props;
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  if ($$props.app === void 0 && $$bindings.app && app !== void 0)
    $$bindings.app(app);
  rect = applyScale(info, scale);
  small = rect.height < 150;
  return `<article class="${"bg-slate-800 p-2 border rounded border-slate-700 flex flex-col absolute box-border overflow-hidden"}" href="${"/remote/select-app/" + escape(info.serial)}" style="${"left: " + escape(rect.x) + "px; top: " + escape(rect.y) + "px; width: " + escape(rect.width) + "px; height: " + escape(rect.height) + "px;"}"><h3 class="${"text-md"}">${escape(info.deviceName || info.serial)}</h3>
	${app ? `TODO` : `<a href="${"/remote/apps/select/" + escape(info.serial)}" class="${[
    "m-auto flex items-center text-center gap-1 rounded-lg transition-colors hover:bg-slate-900",
    (!small ? "flex-col" : "") + " " + (!small ? "p-4" : "") + " " + (small ? "p-2" : "") + " " + (small ? "text-sm" : "")
  ].join(" ").trim()}"><svg viewBox="${"0 0 24 24"}" fill="${"currentColor"}"${add_classes(((!small ? "w-12" : "") + " " + (!small ? "h-12" : "") + " " + (small ? "w-6" : "") + " " + (small ? "h-6" : "")).trim())}><path d="${"M2,2H11V11H2V2M17.5,2C20,2 22,4 22,6.5C22,9 20,11 17.5,11C15,11 13,9 13,6.5C13,4 15,2 17.5,2M6.5,14L11,22H2L6.5,14M19,17H22V19H19V22H17V19H14V17H17V14H19V17Z"}"></path></svg>
			Select App
		</a>`}</article>`;
});
const Remote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let elementSize;
  let buckets;
  let cellCanvasRect;
  let scale;
  let $elementSize, $$unsubscribe_elementSize = noop, $$subscribe_elementSize = () => ($$unsubscribe_elementSize(), $$unsubscribe_elementSize = subscribe(elementSize, ($$value) => $elementSize = $$value), elementSize);
  let $remoteState, $$unsubscribe_remoteState;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  let container;
  $$subscribe_elementSize(elementSize = elementSizeStore(container));
  buckets = splitToBuckets($remoteState);
  cellCanvasRect = cellCanvas(buckets.rectWithPos);
  scale = $elementSize ? fitScale({
    width: $elementSize.width,
    height: Infinity
  }, cellCanvasRect) : 1;
  $$unsubscribe_elementSize();
  $$unsubscribe_remoteState();
  return `<section class="${"relative"}" style="${"height: " + escape(cellCanvasRect.height * scale) + "px"}"${add_attribute("this", container, 0)}>${each(buckets.rectWithPos, (info) => {
    return `${validate_component(SelectAppCard, "SelectAppCard").$$render($$result, { info, scale, app: void 0 }, {}, {})}`;
  })}</section>`;
});
export { Remote as default };
