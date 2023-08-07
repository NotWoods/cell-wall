import { c as create_ssr_component, s as subscribe, v as validate_component, e as escape } from './ssr-966736c7.js';
import { p as page } from './stores-1982239f.js';
import { T as TopBar, R as RemoteFrame } from './TopBar-debc3b53.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `${validate_component(TopBar, "TopBar").$$render($$result, { class: "bg-red-800" }, {}, {})} ${validate_component(RemoteFrame, "RemoteFrame").$$render($$result, {}, {}, {
    default: () => {
      return `<h1 class="mt-0 mb-2 text-4xl font-light">${escape($page.status)} Error</h1> <p class="my-4">${$page.error?.message ? `${escape($page.error.message)}` : `Encounter an error`}</p>`;
    }
  })}`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-0dc8b9e2.js.map
