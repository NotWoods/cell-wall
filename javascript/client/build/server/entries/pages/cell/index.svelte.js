import { c as create_ssr_component, v as validate_component, b as add_attribute } from "../../../chunks/index-50854321.js";
import { F as Form, S as SubmitButton } from "../../../chunks/SubmitButton-185fe575.js";
import { V as VerticalField } from "../../../chunks/VerticalField-e6294eb2.js";
import { p as post } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/snackbar-host-0b24a4c8.js";
import "../../../chunks/index-06c8ab10.js";
const Cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id = "";
  async function submit(formData, action) {
    const data = Object.fromEntries(formData);
    await post(action.toString(), data);
    window.location.pathname = `/cell/frame?id=${id}`;
  }
  return `${$$result.head += `${$$result.title = `<title>New Cell | CellWall</title>`, ""}<link rel="${"stylesheet"}" href="${"https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css"}" data-svelte="svelte-1gz1891">`, ""}

<nav class="${"navbar"}"><div class="${"navbar-brand"}"><a class="${"navbar-item"}" href="${"https://github.com/NotWoods/cell-wall"}"><img src="${"/logo.png"}" alt="${""}" width="${"28"}" height="${"28"}">
			<span style="${"margin-left: 0.5rem"}">CellWall</span></a></div></nav>

<main class="${"section"}"><div class="${"container"}">${validate_component(Form, "Form").$$render($$result, {
    action: "/api/device/" + id,
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      return `${validate_component(VerticalField, "VerticalField").$$render($$result, { for: "control-id", label: "ID" }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-id"}"${add_attribute("class", inputClassName, 0)} name="${"id"}" type="${"text"}" required${add_attribute("value", id, 0)}>`;
        }
      })}
			${validate_component(VerticalField, "VerticalField").$$render($$result, { for: "control-name", label: "Name" }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-name"}"${add_attribute("class", inputClassName, 0)} name="${"name"}" type="${"text"}" required>`;
        }
      })}

			<div class="${"field is-grouped is-grouped-right"}" style="${"margin-top: 3rem"}"><p class="${"control"}"><button type="${"reset"}" class="${"button is-light"}">Reset</button></p>
				${validate_component(SubmitButton, "SubmitButton").$$render($$result, { loading }, {}, {})}</div>`;
    }
  })}</div></main>`;
});
export { Cell as default };
