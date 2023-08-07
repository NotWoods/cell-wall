import { c as create_ssr_component, s as subscribe, e as escape, a as add_attribute, v as validate_component, n as noop } from './ssr-966736c7.js';
import { F as FormattedTime } from './FormattedTime-f6b71fa5.js';
import { f as filterState } from './filter-state-e2092dbc.js';
import { r as readable } from './index2-505c6d08.js';
import { getFrameContext } from './_layout.svelte-bd8a7ccf.js';
import './state-socket-ab578445.js';
import './web-ec6e3b01.js';
import './random-c2405d3d.js';

function messages(messageSource, initialState) {
  return readable(initialState, (set) => {
    const controller = new AbortController();
    messageSource?.addEventListener(
      "message",
      (event) => set(event.data),
      controller
    );
    return () => controller.abort();
  });
}
const css = {
  code: "main.svelte-vg30ut{background:#262626}main.busy.svelte-vg30ut{background:#d87220}main.error.svelte-vg30ut{background:red}.profile.svelte-vg30ut{display:block;border-radius:50%}",
  map: null
};
const knownPeople = new Map(Object.entries({
  "tigeroakes@gmail.com": { name: "Tiger", image: "/img/tiger.jpg" },
  "daphne.liu97@gmail.com": { name: "Daphne", image: "/img/daphne.jpg" }
}));
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let calendarId;
  let workerState;
  let knownPerson;
  let isBusy;
  let error;
  let $workerState, $$unsubscribe_workerState = noop, $$subscribe_workerState = () => ($$unsubscribe_workerState(), $$unsubscribe_workerState = subscribe(workerState, ($$value) => $workerState = $$value), workerState);
  let $busyState, $$unsubscribe_busyState;
  const { state } = getFrameContext();
  const busyState = filterState("BUSY", state);
  $$unsubscribe_busyState = subscribe(busyState, (value) => $busyState = value);
  let worker;
  $$result.css.add(css);
  calendarId = $busyState?.payload;
  $$subscribe_workerState(workerState = messages(worker, { error: "" }));
  knownPerson = calendarId ? knownPeople.get(calendarId) : void 0;
  isBusy = $workerState.isBusy ?? { busy: false };
  error = $workerState.error;
  $$unsubscribe_workerState();
  $$unsubscribe_busyState();
  return `<main class="${[
    "fill center svelte-vg30ut",
    (isBusy.busy ? "busy" : "") + " " + (Boolean(error) ? "error" : "")
  ].join(" ").trim()}">${knownPerson ? `<img class="profile svelte-vg30ut" alt="${"Portrait of " + escape(knownPerson.name, true)}"${add_attribute("src", knownPerson.image, 0)} width="150" height="150">` : ``} <h1 class="headline-1">${escape(isBusy.busy ? "Busy" : "Free")}</h1> ${isBusy.next ? `<span>until ${validate_component(FormattedTime, "FormattedTime").$$render($$result, { time: isBusy.next }, {}, {})}</span>` : ``} ${error ? `<span>${escape(error)}</span>` : ``} </main>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-bd276374.js.map
