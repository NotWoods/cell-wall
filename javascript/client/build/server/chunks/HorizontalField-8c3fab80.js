import { c as create_ssr_component, k as compute_rest_props, l as spread, m as escape_object, p as escape_attribute_value, e as escape, v as validate_component, a as add_attribute } from './ssr-966736c7.js';

const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "for"]);
  let { class: className = "" } = $$props;
  let { for: htmlFor = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0)
    $$bindings.for(htmlFor);
  return `<label${spread(
    [
      escape_object($$restProps),
      { for: escape_attribute_value(htmlFor) },
      {
        class: "block text-sm font-medium text-gray-100 " + escape(className, true)
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</label>`;
});

const INPUT_CLASSES = "block w-full shadow-sm sm:text-sm border-gray-300 rounded-md flex-1";
const HorizontalField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { for: htmlFor = void 0 } = $$props;
  let { label } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0)
    $$bindings.for(htmlFor);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  return `<div class="${"flex flex-col sm:flex-row sm:items-center text-black " + escape(className, true)}">${validate_component(Label, "Label").$$render(
    $$result,
    {
      class: "mb-4 sm:mb-0 sm:mr-4 flex-initial w-36",
      for: htmlFor
    },
    {},
    {
      default: () => {
        return `${escape(label)}`;
      }
    }
  )} ${slots.default ? slots.default({ inputClassName: INPUT_CLASSES }) : ` <input type="text"${add_attribute("id", htmlFor, 0)}${add_attribute("class", INPUT_CLASSES, 0)}> `}</div>`;
});

export { HorizontalField as H, Label as L };
//# sourceMappingURL=HorizontalField-8c3fab80.js.map
