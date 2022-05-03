import { c as create_ssr_component, a as subscribe, b as add_attribute, n as noop } from "../../../../chunks/index-07af9b00.js";
import { f as filterState } from "../../../../chunks/filter-state-522a709a.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/web-9fac8a47.js";
import "../../../../chunks/state-socket-c39d2efa.js";
import "../../../../chunks/random-ca7fbb84.js";
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
var image_svelte_svelte_type_style_lang = "";
const css = {
  code: "img.svelte-6u50n6{background:black}",
  map: null
};
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let imageState;
  let src;
  let fit;
  let $imageState, $$unsubscribe_imageState = noop, $$subscribe_imageState = () => ($$unsubscribe_imageState(), $$unsubscribe_imageState = subscribe(imageState, ($$value) => $imageState = $$value), imageState);
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
  $$result.css.add(css);
  $$subscribe_imageState(imageState = filterState("IMAGE", state));
  src = $imageState ? createBlobUrl($imageState.payload) : void 0;
  fit = objectFit($imageState == null ? void 0 : $imageState.scaleType);
  $$unsubscribe_imageState();
  return `<img class="${"fill svelte-6u50n6"}"${add_attribute("src", src, 0)} alt="${""}"${add_attribute("style", `object-fit: ${fit}`, 0)}>`;
});
export { Image as default };
