import { c as create_ssr_component, v as validate_component, b as add_attribute } from "../../../chunks/index-50854321.js";
import { F as Form } from "../../../chunks/SubmitButton-185fe575.js";
import { V as VerticalField } from "../../../chunks/VerticalField-e6294eb2.js";
import { R as ResetSubmit } from "../../../chunks/_ResetSubmit-902f2b92.js";
import "../../../chunks/snackbar-host-0b24a4c8.js";
import "../../../chunks/index-06c8ab10.js";
const prerender = true;
async function submit(data, action) {
  try {
    const res = await fetch(action.toString(), {
      method: "post",
      headers: { "content-type": "text/plain" },
      body: data.get("text")
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex flex-col gap-y-4",
    action: "/api/action/text",
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      return `${validate_component(VerticalField, "VerticalField").$$render($$result, { for: "control-text", label: "Text" }, {}, {
        default: ({ inputClassName }) => {
          return `<textarea${add_attribute("class", inputClassName, 0)} required id="${"control-text"}" name="${"text"}" rows="${"10"}" placeholder="${" Apple \r Banana \r Carrot"}"></textarea>`;
        }
      })}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Text as default, prerender };
