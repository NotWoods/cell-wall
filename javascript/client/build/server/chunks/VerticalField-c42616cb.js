import { c as create_ssr_component, e as escape, v as validate_component, b as add_attribute } from "./index-4d214b4e.js";
import { L as Label } from "./Label-d8e9b5d6.js";
const INPUT_CLASSES = "block w-full shadow-sm sm:text-sm border-gray-300 rounded-md";
const VerticalField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { for: htmlFor = void 0 } = $$props;
  let { label } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0)
    $$bindings.for(htmlFor);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  return `<div class="${"text-black " + escape(className)}">${validate_component(Label, "Label").$$render($$result, { class: "mb-1", for: htmlFor }, {}, {
    default: () => {
      return `${escape(label)}`;
    }
  })}
	${slots.default ? slots.default({ inputClassName: INPUT_CLASSES }) : `
		<input type="${"text"}"${add_attribute("id", htmlFor, 0)}${add_attribute("class", INPUT_CLASSES, 0)}>
	`}</div>`;
});
export { VerticalField as V };
