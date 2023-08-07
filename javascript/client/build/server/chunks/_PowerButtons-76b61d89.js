import { c as create_ssr_component, v as validate_component } from './ssr-966736c7.js';
import { F as Form, S as SubmitButton } from './DeviceOptions-e3065976.js';

async function post(action, body) {
  try {
    const res = await fetch(action, {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

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
  return `${validate_component(Form, "Form").$$render(
    $$result,
    {
      class: "flex",
      method: "post",
      action: "",
      onSubmit: submit
    },
    {},
    {
      default: ({ status }) => {
        return `<legend class="sr-only" data-svelte-h="svelte-1ws5tgw">Power</legend> ${validate_component(SubmitButton, "SubmitButton").$$render(
          $$result,
          {
            loading: !status.submitterName ? status.loading : notLoading,
            colors,
            disabled: serial === void 0,
            class: "rounded-r-none",
            name: "launch",
            formaction: "/api/action/launch/" + serial,
            "aria-label": "Launch client app"
          },
          {},
          {
            default: () => {
              return `Launch`;
            }
          }
        )} ${validate_component(SubmitButton, "SubmitButton").$$render(
          $$result,
          {
            loading: status.submitterValue === "false" ? status.loading : notLoading,
            colors,
            name: "on",
            value: "false",
            disabled: serial === void 0,
            class: "rounded-r-none rounded-l-none border-l border-r border-slate-500",
            formaction: "/api/device/power/" + serial,
            "aria-label": "Power off"
          },
          {},
          {
            default: () => {
              return `Off`;
            }
          }
        )} ${validate_component(SubmitButton, "SubmitButton").$$render(
          $$result,
          {
            loading: status.submitterValue === "true" ? status.loading : notLoading,
            colors,
            name: "on",
            value: "true",
            disabled: serial === void 0,
            class: "rounded-l-none",
            formaction: "/api/device/power/" + serial,
            "aria-label": "Power on"
          },
          {},
          {
            default: () => {
              return `On`;
            }
          }
        )}`;
      }
    }
  )}`;
});

export { PowerButtons as P, post as p };
//# sourceMappingURL=_PowerButtons-76b61d89.js.map
