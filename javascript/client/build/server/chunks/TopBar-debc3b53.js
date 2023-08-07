import { c as create_ssr_component, a as add_attribute, v as validate_component, s as subscribe, e as escape } from './ssr-966736c7.js';
import { p as page } from './stores-1982239f.js';

const RemoteFrame = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { fullWidth = false } = $$props;
  if ($$props.fullWidth === void 0 && $$bindings.fullWidth && fullWidth !== void 0)
    $$bindings.fullWidth(fullWidth);
  return `<div class="bg-slate-900 bg-gradient-to-r" style="--tw-gradient-stops: hsl(222deg 47% 11%) 0%, hsl(222deg 45% 12%) 11%, hsl(221deg 43% 13%) 22%, hsl(221deg 41% 13%) 33%, hsl(220deg 39% 14%) 44%, hsl(219deg 38% 15%) 56%, hsl(219deg 36% 15%) 67%, hsl(218deg 35% 16%) 78%, hsl(218deg 34% 17%) 89%, hsl(217deg 33% 17%) 100%; min-height: calc(100vh - 3.25rem);"><main class="${["mx-auto p-2 py-4 sm:p-6 lg:p-8", !fullWidth ? "max-w-7xl" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</main></div>`;
});
const TopBarItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { href } = $$props;
  let { class: className = "" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  active = $page.url.pathname === href;
  $$unsubscribe_page();
  return `<a class="${[
    "hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium " + escape(className, true),
    (!active ? "text-gray-300" : "") + " " + (active ? "text-gray-100" : "") + " " + (active ? "bg-green-700" : "")
  ].join(" ").trim()}"${add_attribute("href", href, 0)}>${slots.default ? slots.default({}) : ``}</a>`;
});
const TopBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "bg-green-800" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<nav${add_attribute("class", className, 0)}><div class="top-bar flex flex-wrap gap-2 items-center max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2"> <a class="flex items-center" href="/remote/" data-svelte-h="svelte-1jcr8ui"><img class="block mr-2" src="/logo.png" alt="" width="28" height="28"> <h1 class="sr-only md:not-sr-only text-xl">CellWall Remote</h1></a> ${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/presets" }, {}, {
    default: () => {
      return `Presets`;
    }
  })} ${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/text" }, {}, {
    default: () => {
      return `Text`;
    }
  })} ${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/image" }, {}, {
    default: () => {
      return `Image`;
    }
  })} ${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/canvas" }, {}, {
    default: () => {
      return `Canvas`;
    }
  })} <div class="ml-auto flex flex-wrap gap-2 items-center">${validate_component(TopBarItem, "TopBarItem").$$render($$result, { href: "/remote/edit" }, {}, {
    default: () => {
      return `Edit`;
    }
  })} ${validate_component(TopBarItem, "TopBarItem").$$render(
    $$result,
    {
      href: "https://github.com/NotWoods/cell-wall"
    },
    {},
    {
      default: () => {
        return `<svg class="" xmlns="http://www.w3.org/2000/svg" aria-label="GitHub" role="img" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="M165 512H77c-43 0-77-34-77-77V77C0 34 34 0 77 0h358c43 0 77 34 77 77v358c0 43-34 77-77 77h-88c0-5-2-13-12-13-13 0-16-6-16-12l1-70c0-24-8-40-18-48 57-6 117-28 117-126 0-28-10-51-26-69 3-6 11-32-3-67 0 0-21-7-70 26-42-12-86-12-128 0-49-33-70-26-70-26-14 35-6 61-3 67-16 18-26 41-26 69 0 98 59 120 116 126-7 7-14 18-16 35-15 6-52 17-74-22 0 0-14-24-40-26 0 0-25 0-1 16 0 0 16 7 28 37 0 0 15 50 86 34l1 44c0 6-3 12-16 12-10 0-12 8-12 13Z"></path></svg>`;
      }
    }
  )}</div></div></nav>`;
});

export { RemoteFrame as R, TopBar as T };
//# sourceMappingURL=TopBar-debc3b53.js.map
