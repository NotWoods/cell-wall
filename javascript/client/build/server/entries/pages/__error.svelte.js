import { c as create_ssr_component, e as escape } from "../../chunks/index-0b76d127.js";
var __error_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-1i6hfd5{background-color:#991b1b;color:white}",
  map: null
};
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
  $$result.css.add(css);
  return `<main class="${"svelte-1i6hfd5"}"><h1 class="${"mt-0 mb-2 text-4xl font-light"}">${escape(status)} Error</h1>
	<p class="${"my-4"}">${error.message ? `${escape(error.message)}` : `Encounter an error`}</p>

	<pre>${escape(error.stack)}</pre>
</main>`;
});
export { _error as default, load };
