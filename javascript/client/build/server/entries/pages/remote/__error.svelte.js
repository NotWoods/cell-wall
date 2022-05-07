import { c as create_ssr_component, v as validate_component, e as escape } from "../../../chunks/index-07af9b00.js";
import { T as TopBar, R as RemoteFrame } from "../../../chunks/TopBar-adef7ba1.js";
const load = ({ status, error }) => {
  return { props: { status, error } };
};
const _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0)
    $$bindings.error(error);
  return `${validate_component(TopBar, "TopBar").$$render($$result, { class: "bg-red-800" }, {}, {})}
${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, {}, {}, {
    default: () => {
      return `<h1 class="${"mt-0 mb-2 text-4xl font-light"}">${escape(status)} Error</h1>
	<p class="${"my-4"}">${error.message ? `${escape(error.message)}` : `Encounter an error`}</p>

	<pre>${escape(error.stack)}</pre>`;
    }
  })}`;
});
export { _error as default, load };
