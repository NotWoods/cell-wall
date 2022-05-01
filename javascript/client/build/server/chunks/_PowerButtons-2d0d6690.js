import { c as create_ssr_component, b as add_attribute, v as validate_component } from "./index-0b76d127.js";
import { S as SubmitButton } from "./Form-8ab490a9.js";
const colors = {
  pending: "bg-slate-700",
  success: "bg-slate-700 hover:bg-slate-800"
};
const name = "on";
const PowerButtons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let formAction;
  const notLoading = Promise.resolve();
  let { serial } = $$props;
  Promise.resolve();
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  formAction = `/api/device/power/${serial}`;
  return `<fieldset class="${"flex"}"${add_attribute("name", name, 0)}><legend class="${"sr-only"}">Power</legend>
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
    loading: notLoading,
    colors,
    name,
    value: "false",
    disabled: serial === void 0,
    class: "rounded-r-none border-r border-slate-500",
    formaction: formAction,
    "aria-label": "Power off"
  }, {}, {
    default: () => {
      return `Off
	`;
    }
  })}
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
    loading: notLoading,
    colors,
    name,
    value: "true",
    disabled: serial === void 0,
    class: "rounded-l-none",
    formaction: formAction,
    "aria-label": "Power on"
  }, {}, {
    default: () => {
      return `On
	`;
    }
  })}</fieldset>`;
});
export { PowerButtons as P };
