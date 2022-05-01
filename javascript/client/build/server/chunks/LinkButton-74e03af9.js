import { c as create_ssr_component, h as compute_rest_props, j as spread, k as escape_object, l as escape_attribute_value, e as escape } from "./index-0b76d127.js";
const LinkButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["href", "class"]);
  let { href } = $$props;
  let { class: className = "bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<a${spread([
    escape_object($$restProps),
    { href: escape_attribute_value(href) },
    {
      class: "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors " + escape(className)
    }
  ], {})}>${slots.default ? slots.default({}) : ``}</a>`;
});
export { LinkButton as L };
