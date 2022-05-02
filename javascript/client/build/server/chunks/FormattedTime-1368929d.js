import { c as create_ssr_component, f as each, e as escape, h as null_to_empty } from "./index-07af9b00.js";
var FormattedTime_svelte_svelte_type_style_lang = "";
const css = {
  code: ".dayPeriod.svelte-ubrpjh{font-size:0.5em}",
  map: null
};
const FormattedTime = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let formatter;
  let timeParts;
  let { time } = $$props;
  let { timeZone = void 0 } = $$props;
  if ($$props.time === void 0 && $$bindings.time && time !== void 0)
    $$bindings.time(time);
  if ($$props.timeZone === void 0 && $$bindings.timeZone && timeZone !== void 0)
    $$bindings.timeZone(timeZone);
  $$result.css.add(css);
  formatter = new Intl.DateTimeFormat(void 0, { timeStyle: "short", timeZone });
  timeParts = formatter.formatToParts(time);
  return `${each(timeParts, (part) => {
    return `<span class="${escape(null_to_empty(part.type)) + " svelte-ubrpjh"}">${escape(part.value)}</span>`;
  })}`;
});
export { FormattedTime as F };
