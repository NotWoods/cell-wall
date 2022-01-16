import { c as create_ssr_component, v as validate_component } from "./index-50854321.js";
import { B as Button, S as SubmitButton } from "./SubmitButton-185fe575.js";
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
