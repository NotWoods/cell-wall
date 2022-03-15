import { c as create_ssr_component, h as compute_rest_props, g as getContext, j as spread, k as escape_object, l as escape_attribute_value, b as add_attribute, e as escape, o as is_promise, n as noop, v as validate_component } from "./index-4d214b4e.js";
import { S as SnackbarHostState } from "./snackbar-host-f2ed4131.js";
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
    escape_object($$restProps),
    { method: "post" },
    { action: escape_attribute_value(action) }
  ], {})}${add_attribute("this", form, 0)}>${slots.default ? slots.default({ status, loading: status.loading }) : ``}</form>`;
});
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "for"]);
  let { class: className = "" } = $$props;
  let { for: htmlFor = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0)
    $$bindings.for(htmlFor);
  return `<label${spread([
    escape_object($$restProps),
    { for: escape_attribute_value(htmlFor) },
    {
      class: "block text-sm font-medium text-gray-100 " + escape(className)
    }
  ], {})}>${slots.default ? slots.default({}) : ``}</label>`;
});
const LoadingSpinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "h-4 w-4" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<span class="${"sr-only"}">Loading</span>
<span class="${escape(className) + " block border-2 rounded-full border-r-transparent border-t-transparent animate-spin"}"></span>`;
});
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "bg-slate-700 hover:bg-slate-800" } = $$props;
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
export { Button as B, Form as F, Label as L, SubmitButton as S };
