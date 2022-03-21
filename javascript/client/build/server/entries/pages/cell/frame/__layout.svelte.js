import { g as getContext, c as create_ssr_component, a as subscribe, s as setContext } from "../../../../chunks/index-4d214b4e.js";
import { c as cellState, f as frameUrl, a as connect } from "../../../../chunks/state-socket-c1d8cd72.js";
import "../../../../chunks/cell-state-schema-a24ecc56.js";
import "../../../../chunks/index-23b4b723.js";
function getFrameContext() {
  return getContext("frame");
}
const load = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return {
      status: 400,
      error: new Error("Missing ID")
    };
  }
  return { props: { serial: id } };
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $state, $$unsubscribe_state;
  let { serial } = $$props;
  const socket = connect();
  const state = cellState(socket);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  setContext("frame", { socket, state });
  socket?.addEventListener("error", (event) => console.error("Socket error", event));
  socket?.addEventListener("open", (event) => console.info("Socket open", event));
  socket?.addEventListener("close", (event) => console.info("Socket close", event));
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  frameUrl($state.type, serial);
  $$unsubscribe_state();
  return `${$$result.head += `${$$result.title = `<title>Cell</title>`, ""}`, ""}

${slots.default ? slots.default({}) : ``}`;
});
export { _layout as default, getFrameContext, load };
