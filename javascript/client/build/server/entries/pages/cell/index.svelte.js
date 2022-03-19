import { c as create_ssr_component, v as validate_component, b as add_attribute } from "../../../chunks/index-4d214b4e.js";
import { R as ResetSubmit } from "../../../chunks/ResetSubmit-703d5a7b.js";
import { V as VerticalField } from "../../../chunks/VerticalField-55978348.js";
import { F as Form } from "../../../chunks/SubmitButton-c96a2606.js";
import { T as TopBar, R as RemoteFrame } from "../../../chunks/TopBar-fb618005.js";
import { d as derived, w as writable } from "../../../chunks/index-23b4b723.js";
import "../../../chunks/LoadingSpinner-97b51d95.js";
import "../../../chunks/snackbar-host-d6555a45.js";
import "../../../chunks/cell-state-schema-b294815b.js";
const browser = false;
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const goto = guard("goto");
function lockState() {
  const state = writable({
    active: false
  });
  return {
    state,
    active: derived(state, ($state) => $state.active),
    error: derived(state, ($state) => $state.error)
  };
}
function requestFullScreen() {
  const controller = new AbortController();
  const { state, ...stores } = lockState();
  async function enterFullScreen() {
    try {
      await document.documentElement.requestFullscreen().then(() => state.set({ active: true }), (error) => state.set({ active: false, error }));
      state.set({ active: true });
    } catch (error) {
      if (error instanceof Error) {
        state.set({ active: false, error });
      } else {
        throw error;
      }
    }
  }
  enterFullScreen();
  document.addEventListener("fullscreenchange", () => {
    state.set({ active: Boolean(document.fullscreenElement) });
  }, controller);
  return {
    ...stores,
    async release() {
      controller.abort();
      await document.exitFullscreen();
    }
  };
}
function requestWakeLock() {
  if ("wakeLock" in navigator) {
    let handleVisiblityChange = function() {
      if (wakeLock !== null && document.visibilityState === "visible") {
        requestNewLock();
      }
    };
    const controller = new AbortController();
    let wakeLock;
    const { state, ...stores } = lockState();
    async function requestNewLock() {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
        state.set({ active: true });
        wakeLock.addEventListener("release", () => {
          state.set({ active: false });
        }, controller);
      } catch (error) {
        if (error instanceof DOMException) {
          state.set({ active: false, error });
        } else {
          throw error;
        }
      }
    }
    requestNewLock();
    document.addEventListener("visibilitychange", handleVisiblityChange, controller);
    document.addEventListener("fullscreenchange", handleVisiblityChange, controller);
    return {
      ...stores,
      async release() {
        controller.abort();
        await wakeLock?.release();
      }
    };
  } else {
    return void 0;
  }
}
const load = async ({ url }) => {
  return {
    props: {
      id: url.searchParams.get("id") || "",
      autoJoin: url.searchParams.has("autojoin")
    }
  };
};
const Cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { autoJoin = false } = $$props;
  async function submit() {
    requestFullScreen();
    requestWakeLock();
    await goto(`/cell/frame/blank?id=${id}`, { replaceState: false });
  }
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.autoJoin === void 0 && $$bindings.autoJoin && autoJoin !== void 0)
    $$bindings.autoJoin(autoJoin);
  {
    {
      if (autoJoin && browser) {
        submit();
      }
    }
  }
  return `${$$result.head += `${$$result.title = `<title>New Cell | CellWall</title>`, ""}`, ""}

${!autoJoin ? `${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})}` : ``}
${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Form, "Form").$$render($$result, {
        class: "flex flex-col gap-y-4",
        action: "/cell/frame/blank",
        method: "get",
        onSubmit: submit
      }, {}, {
        default: ({ loading }) => {
          return `${validate_component(VerticalField, "VerticalField").$$render($$result, { for: "control-id", label: "ID" }, {}, {
            default: ({ inputClassName }) => {
              return `<input id="${"control-id"}"${add_attribute("class", inputClassName, 0)} name="${"id"}" type="${"text"}" required${add_attribute("value", id, 0)}>`;
            }
          })}

		${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
        }
      })}`;
    }
  })}`;
});
export { Cell as default, load };
