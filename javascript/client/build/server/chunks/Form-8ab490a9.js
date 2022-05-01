import { c as create_ssr_component, h as compute_rest_props, j as spread, k as escape_object, e as escape, o as is_promise, n as noop, v as validate_component, g as getContext, l as escape_attribute_value, b as add_attribute } from "./index-0b76d127.js";
import { S as SnackbarHostState } from "./snackbar-host-fe054673.js";
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<button${spread([
    { type: "button" },
    escape_object($$restProps),
    {
      class: "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors " + escape(className)
    }
  ], {})}>${slots.default ? slots.default({}) : ``}</button>`;
});
const LoadingSpinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "h-4 w-4" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<span class="${"sr-only"}">Loading</span>
<span class="${escape(className) + " block border-2 rounded-full border-r-transparent border-t-transparent animate-spin"}"></span>`;
});
const DEFAULT_COLORS = {
  pending: "bg-green-500",
  success: "bg-green-500 hover:bg-green-600",
  error: "bg-red-500"
};
const SubmitButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["loading", "class", "colors"]);
  let { loading } = $$props;
  let { class: className = "" } = $$props;
  let { colors = {} } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.colors === void 0 && $$bindings.colors && colors !== void 0)
    $$bindings.colors(colors);
  return `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
	${validate_component(Button, "Button").$$render($$result, Object.assign($$restProps, { type: "submit" }, {
        class: className + " relative " + (colors.pending ?? DEFAULT_COLORS.pending)
      }), {}, {
        default: () => {
          return `<div class="${"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}">${validate_component(LoadingSpinner, "LoadingSpinner").$$render($$result, {}, {}, {})}</div>
		<span class="${"text-transparent"}" aria-hidden="${"true"}">${slots.default ? slots.default({}) : `Submit`}</span>`;
        }
      })}
`;
    }
    return function(_) {
      return `
	${validate_component(Button, "Button").$$render($$result, Object.assign($$restProps, { type: "submit" }, {
        class: className + " relative " + (colors.success ?? DEFAULT_COLORS.success)
      }), {}, {
        default: () => {
          return `${slots.default ? slots.default({}) : `Submit`}`;
        }
      })}
`;
    }();
  }(loading)}`;
});
const Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["action", "onSubmit"]);
  getContext(SnackbarHostState);
  let { action } = $$props;
  let { onSubmit } = $$props;
  let form;
  let status = {
    loading: Promise.resolve(),
    submitterName: "",
    submitterValue: ""
  };
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.onSubmit === void 0 && $$bindings.onSubmit && onSubmit !== void 0)
    $$bindings.onSubmit(onSubmit);
  return `<form${spread([
    { method: "post" },
    escape_object($$restProps),
    { action: escape_attribute_value(action) }
  ], {})}${add_attribute("this", form, 0)}>${slots.default ? slots.default({ status, loading: status.loading }) : ``}</form>`;
});
export { Button as B, Form as F, SubmitButton as S };
