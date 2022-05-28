import { c as create_ssr_component, v as validate_component } from "./index-07af9b00.js";
import { F as Form, S as SubmitButton } from "./Form-30d2fdc9.js";
import { p as post } from "./_form-52443b97.js";
const colors = {
  pending: "bg-slate-700",
  success: "bg-slate-700 hover:bg-slate-800"
};
const PowerButtons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const notLoading = Promise.resolve();
  let { serial } = $$props;
  async function submit(formData, action) {
    const data = Object.fromEntries(formData);
    await post(action.toString(), data);
  }
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex",
    method: "post",
    action: "",
    onSubmit: submit
  }, {}, {
    default: ({ status }) => {
      return `<legend class="${"sr-only"}">Power</legend>
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
        loading: !status.submitterName ? status.loading : notLoading,
        colors,
        disabled: serial === void 0,
        class: "rounded-r-none",
        name: "launch",
        formaction: "/api/action/launch/" + serial,
        "aria-label": "Launch client app"
      }, {}, {
        default: () => {
          return `Launch
	`;
        }
      })}
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
        loading: status.submitterValue === "false" ? status.loading : notLoading,
        colors,
        name: "on",
        value: "false",
        disabled: serial === void 0,
        class: "rounded-r-none rounded-l-none border-l border-r border-slate-500",
        formaction: "/api/device/power/" + serial,
        "aria-label": "Power off"
      }, {}, {
        default: () => {
          return `Off
	`;
        }
      })}
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
        loading: status.submitterValue === "true" ? status.loading : notLoading,
        colors,
        name: "on",
        value: "true",
        disabled: serial === void 0,
        class: "rounded-l-none",
        formaction: "/api/device/power/" + serial,
        "aria-label": "Power on"
      }, {}, {
        default: () => {
          return `On
	`;
        }
      })}`;
    }
  })}`;
});
export { PowerButtons as P };
