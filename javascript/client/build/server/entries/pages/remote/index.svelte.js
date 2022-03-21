import { c as create_ssr_component, e as escape, v as validate_component, f as add_classes } from "../../../chunks/index-4d214b4e.js";
import { S as SubmitButton, F as Form } from "../../../chunks/SubmitButton-5e66dc23.js";
import { V as VerticalField } from "../../../chunks/VerticalField-c42616cb.js";
import { f as formDataAsSearchParams } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/snackbar-host-a60c3b5b.js";
import "../../../chunks/cell-state-schema-a24ecc56.js";
import "../../../chunks/index-23b4b723.js";
import "../../../chunks/Label-d8e9b5d6.js";
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<article class="${"bg-slate-800 p-4 border rounded border-slate-700 " + escape(className)}">${slots.default ? slots.default({}) : ``}</article>`;
});
const PresetCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selfStatus;
  let { title } = $$props;
  let { preset = void 0 } = $$props;
  let { formAction = void 0 } = $$props;
  let { large = false } = $$props;
  let { button = "Activate" } = $$props;
  let { status } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.preset === void 0 && $$bindings.preset && preset !== void 0)
    $$bindings.preset(preset);
  if ($$props.formAction === void 0 && $$bindings.formAction && formAction !== void 0)
    $$bindings.formAction(formAction);
  if ($$props.large === void 0 && $$bindings.large && large !== void 0)
    $$bindings.large(large);
  if ($$props.button === void 0 && $$bindings.button && button !== void 0)
    $$bindings.button(button);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  selfStatus = status.submitterName === "preset" && status.submitterValue === preset ? status.loading : Promise.resolve();
  return `${validate_component(Card, "Card").$$render($$result, { class: "flex flex-col gap-y-4" }, {}, {
    default: () => {
      return `<h3${add_classes(((large ? "text-2xl" : "") + " " + (!large ? "text-xl" : "")).trim())}>${escape(title)}</h3>
	<div class="${""}">${slots.default ? slots.default({}) : ``}</div>
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
        class: "mt-auto self-end",
        loading: selfStatus,
        name: "preset",
        value: preset,
        formaction: formAction
      }, {}, {
        default: () => {
          return `${escape(button)}`;
        }
      })}`;
    }
  })}`;
});
const prerender = true;
const Remote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  async function submit(data, action) {
    const res = await fetch(action.toString(), {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formDataAsSearchParams(data)
    });
    const result = await res.json();
    console.log(result);
  }
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
    action: "/api/device/preset",
    onSubmit: submit
  }, {}, {
    default: ({ status }) => {
      return `${validate_component(Card, "Card").$$render($$result, { class: "row-span-2" }, {}, {
        default: () => {
          return `<h2 class="${"text-3xl mb-4"}">Presets</h2>
		${validate_component(VerticalField, "VerticalField").$$render($$result, {
            label: "Remaining cells",
            for: "control-rest"
          }, {}, {
            default: ({ inputClassName }) => {
              return `<select id="${"control-rest"}" name="${"rest"}" class="${escape(inputClassName) + " cursor-pointer"}"><option value="${"ignore"}">Ignore</option><option value="${"blank"}">Blank</option><option value="${"off"}">Off</option></select>`;
            }
          })}
		<img class="${"block mt-4 shadow-inner rounded"}" alt="${""}" src="${"https://raw.githubusercontent.com/NotWoods/cell-wall/main/images/finished.jpg"}">`;
        }
      })}

	${validate_component(PresetCard, "PresetCard").$$render($$result, {
        title: "Info",
        preset: "info",
        large: true,
        status
      }, {}, {
        default: () => {
          return `Calendar indicators and the week&#39;s weather.
	`;
        }
      })}
	${validate_component(PresetCard, "PresetCard").$$render($$result, {
        title: "Tea list",
        preset: "tea",
        large: true,
        status
      }, {}, {
        default: () => {
          return `What&#39;s avaliable to drink?`;
        }
      })}
	${validate_component(PresetCard, "PresetCard").$$render($$result, {
        title: "Actions",
        button: "Launch on devices",
        formAction: "/api/action/launch",
        status
      }, {}, {
        default: () => {
          return `<a class="${"px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800"}" href="${"/remote/third_party"}">SDK Login
		</a>
		${validate_component(SubmitButton, "SubmitButton").$$render($$result, {
            name: "action",
            value: "install",
            loading: status.submitterName === "action" && status.submitterValue === "install" ? status.loading : Promise.resolve(),
            formaction: "/api/action/install"
          }, {}, {
            default: () => {
              return `Install`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
export { Remote as default, prerender };
