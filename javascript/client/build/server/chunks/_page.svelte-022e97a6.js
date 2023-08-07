import { c as create_ssr_component, s as subscribe, a as add_attribute, e as escape } from './ssr-966736c7.js';
import { f as filterState } from './filter-state-e2092dbc.js';
import { getFrameContext } from './_layout.svelte-bd8a7ccf.js';
import './index2-505c6d08.js';
import './state-socket-ab578445.js';
import './web-ec6e3b01.js';
import './random-c2405d3d.js';

function createBlobUrlFactory() {
  let lastUrl = "";
  return function createBlobUrl(blob) {
    if (lastUrl.startsWith("blob:")) {
      URL.revokeObjectURL(lastUrl);
    }
    if (typeof blob === "string") {
      lastUrl = blob;
    } else {
      if (!(blob instanceof Blob)) {
        blob = new Blob([blob]);
      }
      lastUrl = URL.createObjectURL(blob);
    }
    return lastUrl;
  };
}
const css = {
  code: "img.svelte-6u50n6{background:black}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let src;
  let fit;
  let $imageState, $$unsubscribe_imageState;
  const createBlobUrl = createBlobUrlFactory();
  function objectFit(fit2) {
    switch (fit2) {
      case "FIT_CENTER":
      case void 0:
        return "contain";
      case "FIT_XY":
        return "fill";
      case "CENTER_INSIDE":
        return "cover";
    }
  }
  const { state } = getFrameContext();
  const imageState = filterState("IMAGE", state);
  $$unsubscribe_imageState = subscribe(imageState, (value) => $imageState = value);
  $$result.css.add(css);
  src = $imageState ? createBlobUrl($imageState.payload) : void 0;
  fit = objectFit($imageState?.scaleType);
  $$unsubscribe_imageState();
  return `<img class="fill svelte-6u50n6"${add_attribute("src", src, 0)} alt="" style="${"object-fit: " + escape(fit, true)}">`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-022e97a6.js.map
