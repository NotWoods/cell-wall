import { c as create_ssr_component, j as compute_rest_props, k as spread, l as escape_object, o as escape_attribute_value, e as escape } from "./index-07af9b00.js";
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
export { Label as L };
