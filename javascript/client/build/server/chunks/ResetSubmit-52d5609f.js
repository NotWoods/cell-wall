import { c as create_ssr_component, v as validate_component } from "./index-4d214b4e.js";
import { B as Button, S as SubmitButton } from "./SubmitButton-d1b813d7.js";
const ResetSubmit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { loading } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  return `<div class="${"mt-6 ml-auto"}">${validate_component(Button, "Button").$$render($$result, { type: "reset" }, {}, {
    default: () => {
      return `Reset`;
    }
  })}
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, { loading }, {}, {})}</div>`;
});
export { ResetSubmit as R };
