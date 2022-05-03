import { c as create_ssr_component, a as subscribe, e as escape, b as add_attribute, v as validate_component, n as noop } from "../../../../chunks/index-07af9b00.js";
import { F as FormattedTime } from "../../../../chunks/FormattedTime-1368929d.js";
import { f as filterState } from "../../../../chunks/filter-state-522a709a.js";
import { r as readable } from "../../../../chunks/web-9fac8a47.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-c39d2efa.js";
import "../../../../chunks/random-ca7fbb84.js";
function messages(messageSource, initialState) {
  return readable(initialState, (set) => {
    const controller = new AbortController();
    messageSource == null ? void 0 : messageSource.addEventListener("message", (event) => set(event.data), controller);
    return () => controller.abort();
  });
}
var busy_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-vg30ut{background:#262626}main.busy.svelte-vg30ut{background:#d87220}main.error.svelte-vg30ut{background:red}.profile.svelte-vg30ut{display:block;border-radius:50%}",
  map: null
};
const knownPeople = new Map(Object.entries({
  "tigeroakes@gmail.com": { name: "Tiger", image: "/img/tiger.jpg" },
  "daphne.liu97@gmail.com": { name: "Daphne", image: "/img/daphne.jpg" }
}));
const Busy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let busyState;
  let calendarId;
  let workerState;
  let knownPerson;
  let isBusy;
  let error;
  let $workerState, $$unsubscribe_workerState = noop, $$subscribe_workerState = () => ($$unsubscribe_workerState(), $$unsubscribe_workerState = subscribe(workerState, ($$value) => $workerState = $$value), workerState);
  let $busyState, $$unsubscribe_busyState = noop, $$subscribe_busyState = () => ($$unsubscribe_busyState(), $$unsubscribe_busyState = subscribe(busyState, ($$value) => $busyState = $$value), busyState);
  const { state } = getFrameContext();
  let worker;
  $$result.css.add(css);
  $$subscribe_busyState(busyState = filterState("BUSY", state));
  calendarId = $busyState == null ? void 0 : $busyState.payload;
  {
    {
      worker == null ? void 0 : worker.postMessage(calendarId);
    }
  }
  $$subscribe_workerState(workerState = messages(worker, { error: "" }));
  knownPerson = calendarId ? knownPeople.get(calendarId) : void 0;
  isBusy = $workerState.isBusy ?? { busy: false };
  error = $workerState.error;
  $$unsubscribe_workerState();
  $$unsubscribe_busyState();
  return `<main class="${[
    "fill center svelte-vg30ut",
    (isBusy.busy ? "busy" : "") + " " + (Boolean(error) ? "error" : "")
  ].join(" ").trim()}">${knownPerson ? `<img class="${"profile svelte-vg30ut"}" alt="${"Portrait of " + escape(knownPerson.name)}"${add_attribute("src", knownPerson.image, 0)} width="${"150"}" height="${"150"}">` : ``}
	<h1 class="${"headline-1"}">${escape(isBusy.busy ? "Busy" : "Free")}</h1>
	${isBusy.next ? `<span>until ${validate_component(FormattedTime, "FormattedTime").$$render($$result, { time: isBusy.next }, {}, {})}</span>` : ``}
	${error ? `<span>${escape(error)}</span>` : ``}
</main>`;
});
export { Busy as default };
