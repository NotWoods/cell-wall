import { c as create_ssr_component, a as subscribe, b as add_attribute, e as escape, v as validate_component, s as setContext } from "../../../chunks/index-50854321.js";
import { n as navigating } from "../../../chunks/stores-530216e4.js";
import { S as SnackbarHostState } from "../../../chunks/snackbar-host-0b24a4c8.js";
import "../../../chunks/index-06c8ab10.js";
var NavigationProgress_svelte_svelte_type_style_lang = "";
const css = {
  code: ".progress-bar-value.svelte-7f51jt{transform-origin:0% 50%;animation:svelte-7f51jt-indeterminateAnimation 1s infinite linear}@keyframes svelte-7f51jt-indeterminateAnimation{0%{transform:translateX(0) scaleX(0)}40%{transform:translateX(0) scaleX(0.4)}100%{transform:translateX(100%) scaleX(0.5)}}",
  map: null
};
const NavigationProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  $$result.css.add(css);
  $$unsubscribe_navigating();
  return `${$navigating != null ? `<div class="${"absolute w-full h-1 bg-green-900 overflow-hidden"}" role="${"progressbar"}"${add_attribute("aria-valuemin", 0, 0)}${add_attribute("aria-valuemax", 1, 0)} aria-valuetext="${"Loading " + escape($navigating?.to?.pathname)}"><div class="${"progress-bar-value w-full h-full bg-gray-200 svelte-7f51jt"}"></div></div>` : ``}`;
});
const Snackbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${data ? `<aside role="${"alert"}" class="${"fixed inset-4 top-auto bg-gray-200 text-black mx-auto px-4 py-2 max-w-lg"}"><button type="${"button"}" class="${"rounded-md float-right text-gray-600 hover:text-black"}" title="${"Dismiss snackbar"}"><span class="${"sr-only"}">Dismiss snackbar</span>
			<svg class="${"h-6 w-6 transition-colors"}" fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}" aria-hidden="${"true"}"><path stroke-linecap="${"round"}" stroke-linejoin="${"round"}" stroke-width="${"2"}" d="${"M6 18L18 6M6 6l12 12"}"></path></svg></button>

		${escape(data.message)}</aside>` : ``}`;
});
const TopBarItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href } = $$props;
  let { active = false } = $$props;
  let { class: className = "" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<a class="${[
    "text-gray-300 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium " + escape(className),
    (active ? "bg-green-700" : "") + " " + (active ? "text-white" : "")
  ].join(" ").trim()}"${add_attribute("href", href, 0)}>${slots.default ? slots.default({}) : ``}</a>`;
});
const TopBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<nav class="${"bg-green-800"}"><div class="${"top-bar flex flex-wrap gap-x-4 items-center max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2"}">
		<a class="${"flex items-center"}" href="${"https://github.com/NotWoods/cell-wall"}"><img class="${"block mr-2"}" src="${"/logo.png"}" alt="${""}" width="${"28"}" height="${"28"}">
			<h1 class="${"sr-only md:not-sr-only text-xl"}">CellWall Remote</h1></a>

		${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/" }, {}, {
    default: () => {
      return `Presets`;
    }
  })}
		${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/text" }, {}, {
    default: () => {
      return `Text`;
    }
  })}
		${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/image" }, {}, {
    default: () => {
      return `Image`;
    }
  })}
		${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/custom" }, {}, {
    default: () => {
      return `Custom`;
    }
  })}
		${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/edit", class: "ml-auto" }, {}, {
    default: () => {
      return `Edit`;
    }
  })}</div></nav>`;
});
var tailwind = "";
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentSnackbarData, $$unsubscribe_currentSnackbarData;
  const snackbarHostState = new SnackbarHostState();
  const { currentSnackbarData } = snackbarHostState;
  $$unsubscribe_currentSnackbarData = subscribe(currentSnackbarData, (value) => $currentSnackbarData = value);
  setContext(SnackbarHostState, snackbarHostState);
  $$unsubscribe_currentSnackbarData();
  return `${$$result.head += `${$$result.title = `<title>CellWall Remote</title>`, ""}<link rel="${"manifest"}" href="${"/manifest.webmanifest"}" data-svelte="svelte-1tkg7m6">`, ""}

${validate_component(NavigationProgress, "NavigationProgress").$$render($$result, {}, {}, {})}
${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})}

<div class="${"bg-slate-900 bg-gradient-to-r"}" style="${"--tw-gradient-stops: hsl(222deg 47% 11%) 0%, hsl(222deg 45% 12%) 11%, hsl(221deg 43% 13%) 22%, hsl(221deg 41% 13%) 33%, hsl(220deg 39% 14%) 44%, hsl(219deg 38% 15%) 56%, hsl(219deg 36% 15%) 67%, hsl(218deg 35% 16%) 78%, hsl(218deg 34% 17%) 89%, hsl(217deg 33% 17%) 100%; min-height: calc(100vh - 3.25rem);"}"><main class="${"max-w-7xl mx-auto p-2 py-4 sm:p-6 lg:p-8"}">${slots.default ? slots.default({}) : ``}</main></div>

${validate_component(Snackbar, "Snackbar").$$render($$result, { data: $currentSnackbarData }, {}, {})}`;
});
export { _layout as default };
