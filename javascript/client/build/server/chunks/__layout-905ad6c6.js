import { c as create_ssr_component, a as subscribe, b as add_attribute, e as escape, g as getContext, s as setContext, v as validate_component } from "./index-4d214b4e.js";
import { n as navigating, T as TopBar, R as RemoteFrame } from "./TopBar-fb618005.js";
import { d as derived, r as readable } from "./index-23b4b723.js";
import { S as SnackbarHostState } from "./snackbar-host-f2ed4131.js";
var NavigationProgress_svelte_svelte_type_style_lang = "";
const css = {
  code: ".progress-bar-value.svelte-7f51jt{transform-origin:0% 50%;animation:svelte-7f51jt-indeterminateAnimation 1s infinite linear}@keyframes svelte-7f51jt-indeterminateAnimation{0%{transform:translateX(0) scaleX(0)}40%{transform:translateX(0) scaleX(0.4)}100%{transform:translateX(100%) scaleX(0.5)}}",
  map: null
};
const NavigationProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  $$result.css.add(css);
  $$unsubscribe_navigating();
  return `${$navigating != null ? `<div class="${"absolute w-full h-1 bg-green-900 overflow-hidden"}" role="${"progressbar"}"${add_attribute("aria-valuemin", 0, 0)}${add_attribute("aria-valuemax", 1, 0)} aria-valuetext="${"Loading " + escape($navigating?.to?.pathname)}"><div class="${"progress-bar-value w-full h-full bg-gray-200 svelte-7f51jt"}"></div></div>` : ``}`;
});
const Snackbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${data ? `<aside role="${"alert"}" class="${"fixed inset-4 top-auto bg-gray-200 text-black mx-auto px-4 py-2 max-w-lg"}"><button type="${"button"}" class="${"rounded-md float-right text-gray-600 hover:text-black"}" title="${"Dismiss snackbar"}"><span class="${"sr-only"}">Dismiss snackbar</span>
			<svg class="${"h-6 w-6 transition-colors"}" fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}" aria-hidden="${"true"}"><path stroke-linecap="${"round"}" stroke-linejoin="${"round"}" stroke-width="${"2"}" d="${"M6 18L18 6M6 6l12 12"}"></path></svg></button>

		${escape(data.message)}</aside>` : ``}`;
});
function connectRemote() {
  {
    return void 0;
  }
}
function remoteState(socket) {
  return readable(/* @__PURE__ */ new Map(), (set) => {
    const controller = new AbortController();
    function handleMessage({ data }) {
      const cellData = JSON.parse(data);
      const cellMap = new Map(Object.entries(cellData));
      set(cellMap);
    }
    socket?.addEventListener("message", handleMessage, controller);
    return () => controller.abort();
  });
}
function storeValues(store) {
  return derived(store, (map) => Array.from(map.values()));
}
function getRemoteContext() {
  return getContext("remote");
}
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentSnackbarData, $$unsubscribe_currentSnackbarData;
  const socket = connectRemote();
  const state = remoteState(socket);
  setContext("remote", { socket, state });
  const snackbarHostState = new SnackbarHostState();
  const { currentSnackbarData } = snackbarHostState;
  $$unsubscribe_currentSnackbarData = subscribe(currentSnackbarData, (value) => $currentSnackbarData = value);
  setContext(SnackbarHostState, snackbarHostState);
  socket?.addEventListener("error", (event) => console.error("RemoteSocket error", event));
  socket?.addEventListener("open", (event) => console.info("RemoteSocket open", event));
  socket?.addEventListener("close", (event) => console.info("RemoteSocket close", event));
  $$unsubscribe_currentSnackbarData();
  return `${$$result.head += `${$$result.title = `<title>CellWall Remote</title>`, ""}<link rel="${"manifest"}" href="${"/manifest.webmanifest"}" data-svelte="svelte-1tkg7m6">`, ""}

${validate_component(NavigationProgress, "NavigationProgress").$$render($$result, {}, {}, {})}
${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})}
${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}

${validate_component(Snackbar, "Snackbar").$$render($$result, { data: $currentSnackbarData }, {}, {})}`;
});
export { _layout as _, getRemoteContext as g, storeValues as s };
