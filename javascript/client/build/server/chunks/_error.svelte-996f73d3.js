import { c as create_ssr_component, s as subscribe, e as escape } from './ssr-966736c7.js';
import { p as page } from './stores-1982239f.js';

const css = {
  code: "main.svelte-1i6hfd5{background-color:#991b1b;color:white}",
  map: null
};
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  $$unsubscribe_page();
  return `<main class="svelte-1i6hfd5"><h1 class="mt-0 mb-2 text-4xl font-light">${escape($page.status)} Error</h1> <p class="my-4">${$page.error?.message ? `${escape($page.error.message)}` : `Encounter an error`}</p> </main>`;
});

export { Error as default };
//# sourceMappingURL=_error.svelte-996f73d3.js.map
