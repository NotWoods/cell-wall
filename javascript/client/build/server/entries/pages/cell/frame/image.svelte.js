import { c as create_ssr_component, a as subscribe, b as add_attribute } from "../../../../chunks/index-4d214b4e.js";
import "../../../../chunks/cell-state-schema-a24ecc56.js";
import { f as filterState } from "../../../../chunks/index-31161e5d.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/index-23b4b723.js";
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
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let imageState;
  let src;
  let fit;
  let $state, $$unsubscribe_state;
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
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  imageState = filterState("IMAGE", $state);
  src = imageState ? createBlobUrl(imageState.payload) : void 0;
  fit = objectFit(imageState?.scaleType);
  $$unsubscribe_state();
  return `<img class="${"fill"}"${add_attribute("src", src, 0)} alt="${""}"${add_attribute("style", `object-fit: ${fit}`, 0)}>`;
});
export { Image as default };
