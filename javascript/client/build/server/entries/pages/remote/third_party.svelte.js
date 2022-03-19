import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute } from "../../../chunks/index-4d214b4e.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-12292c4d.js";
import { L as LoadingSpinner } from "../../../chunks/LoadingSpinner-97b51d95.js";
import { r as readable } from "../../../chunks/index-23b4b723.js";
import { g as getSnackbarHostContext } from "../../../chunks/__layout-3ca1fd0f.js";
import "../../../chunks/TopBar-fb618005.js";
import "../../../chunks/snackbar-host-6f301a82.js";
import "../../../chunks/cell-state-schema-de0c81a8.js";
function connectThirdParty() {
  {
    return void 0;
  }
}
function thirdPartyState(socket) {
  return readable({ google_loading: true }, (set) => {
    const controller = new AbortController();
    function handleMessage({ data }) {
      const state = JSON.parse(data);
      set(state);
    }
    socket?.addEventListener("message", handleMessage, controller);
    return () => controller.abort();
  });
}
const buttonClassNames = "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50";
const Third_party = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $state, $$unsubscribe_state;
  const socket = connectThirdParty();
  const state = thirdPartyState(socket);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  const snackbarHostState = getSnackbarHostContext();
  socket?.addEventListener("error", (event) => {
    console.error("ThirdPartySocket error", event);
    snackbarHostState.showSnackbar("Third party socket error");
  });
  socket?.addEventListener("open", (event) => console.info("ThirdPartySocket open", event));
  socket?.addEventListener("close", (event) => console.info("ThirdPartySocket close", event));
  $$unsubscribe_state();
  return `${$$result.head += `${$$result.title = `<title>SDK Login | CellWall</title>`, ""}`, ""}

<p class="${"mb-6"}">Connect to third party APIs to use in CellWall.</p>

${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Google" }, {}, {
    default: () => {
      return `${$state.google_loading ? `${validate_component(LoadingSpinner, "LoadingSpinner").$$render($$result, {}, {}, {})}` : `${$state.google_authorize_url ? `<a${add_attribute("class", buttonClassNames, 0)}${add_attribute("href", $state.google_authorize_url, 0)}>Sign in to Google</a>` : `<button${add_attribute("class", buttonClassNames, 0)} type="${"button"}" disabled>Logged in to Google</button>`}`}`;
    }
  })}`;
});
export { Third_party as default };
