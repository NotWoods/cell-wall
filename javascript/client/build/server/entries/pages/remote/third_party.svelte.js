import { c as create_ssr_component, v as validate_component, b as add_attribute } from "../../../chunks/index-0b76d127.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-43bf7a7b.js";
import "../../../chunks/Label-a17ce47a.js";
const load = async () => {
  const response = await fetch("/api/third_party/");
  if (!response.ok) {
    return {
      status: response.status,
      error: new Error(`Could not load, ${response.statusText}`)
    };
  }
  const body = await response.json();
  return {
    props: { googleAuthUrl: body.google_authorize_url }
  };
};
const buttonClassNames = "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50";
const Third_party = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { googleAuthUrl } = $$props;
  if ($$props.googleAuthUrl === void 0 && $$bindings.googleAuthUrl && googleAuthUrl !== void 0)
    $$bindings.googleAuthUrl(googleAuthUrl);
  return `${$$result.head += `${$$result.title = `<title>SDK Login | CellWall</title>`, ""}`, ""}

<p class="${"mb-6"}">Connect to third party APIs to use in CellWall.</p>

${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Google" }, {}, {
    default: () => {
      return `${googleAuthUrl ? `<a${add_attribute("class", buttonClassNames, 0)}${add_attribute("href", googleAuthUrl, 0)}>Sign in to Google</a>` : `<button${add_attribute("class", buttonClassNames, 0)} type="${"button"}" disabled>Logged in to Google</button>`}`;
    }
  })}`;
});
export { Third_party as default, load };
