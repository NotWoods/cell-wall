import { c as create_ssr_component, v as validate_component, a as add_attribute } from './ssr-966736c7.js';
import { H as HorizontalField } from './HorizontalField-8c3fab80.js';

const buttonClassNames = "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-g0c9cv_START -->${$$result.title = `<title>SDK Login | CellWall</title>`, ""}<!-- HEAD_svelte-g0c9cv_END -->`, ""} <p class="mb-6" data-svelte-h="svelte-lkg7vh">Connect to third party APIs to use in CellWall.</p> ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Google" }, {}, {
    default: () => {
      return `${data.googleAuthUrl ? `<a${add_attribute("class", buttonClassNames, 0)}${add_attribute("href", data.googleAuthUrl, 0)}>Sign in to Google</a>` : `<button${add_attribute("class", buttonClassNames, 0)} type="button" disabled>Logged in to Google</button>`}`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-bf3b96e4.js.map
