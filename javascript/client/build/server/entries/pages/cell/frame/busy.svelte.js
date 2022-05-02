import { c as create_ssr_component, a as subscribe, e as escape, b as add_attribute, v as validate_component, n as noop } from "../../../../chunks/index-07af9b00.js";
import { r as readable } from "../../../../chunks/web-c1f4ba88.js";
import { Temporal } from "@js-temporal/polyfill";
import { F as FormattedTime } from "../../../../chunks/FormattedTime-1368929d.js";
import { f as filterState } from "../../../../chunks/filter-state-644ea021.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-9cad1e3b.js";
import "../../../../chunks/random-ca7fbb84.js";
async function freeBusy(options) {
  const toStringOptions = {
    timeZoneName: "never",
    smallestUnit: "second"
  };
  const request = {
    timeMin: options.timeMin.toString(toStringOptions),
    timeMax: options.timeMax.toString(toStringOptions),
    items: options.items
  };
  return await fetch("/api/third_party/freebusy", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });
}
var busy_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-vg30ut{background:#262626}main.busy.svelte-vg30ut{background:#d87220}main.error.svelte-vg30ut{background:red}.profile.svelte-vg30ut{display:block;border-radius:50%}",
  map: null
};
const knownPeople = new Map(Object.entries({
  "tigeroakes@gmail.com": {
    name: "Tiger",
    image: "/assets/img/tiger.jpg"
  },
  "daphne.liu97@gmail.com": {
    name: "Daphne",
    image: "/assets/img/daphne.jpg"
  }
}));
async function fetchFreeBusy(calendarId) {
  const today = Temporal.Now.zonedDateTimeISO("UTC").startOfDay();
  const response = await freeBusy({
    timeMin: today,
    timeMax: today.add({ days: 5 }),
    items: [{ id: calendarId }]
  });
  if (!response.ok) {
    throw new Error(`Could not load calendar, ${response.statusText}`);
  }
  return await response.json();
}
function isBusyInterval(ranges) {
  const dateTimeRanges = ranges.map(function convert(range) {
    function fromTimeStamp(timestamp) {
      if (timestamp) {
        return Temporal.Instant.from(timestamp).toZonedDateTimeISO("UTC");
      } else {
        return void 0;
      }
    }
    return {
      start: fromTimeStamp(range.start),
      end: fromTimeStamp(range.end)
    };
  });
  function isBusy(time) {
    for (const range of dateTimeRanges) {
      const { start, end } = range;
      if (start && Temporal.ZonedDateTime.compare(time, start) < 0) {
        return { busy: false, next: range.start };
      } else if (!end || Temporal.ZonedDateTime.compare(time, end) <= 0) {
        return { busy: true, next: range.end };
      } else {
        continue;
      }
    }
    return { busy: false };
  }
  return readable({ busy: false }, (set) => {
    let timeoutId;
    function checkBusy() {
      const now = Temporal.Now.zonedDateTimeISO("UTC");
      const { busy, next } = isBusy(now);
      set({ busy, next });
      if (next) {
        const duration = now.until(next);
        console.log(`Waiting until ${duration}`);
        const ms = duration.total({ unit: "milliseconds" });
        setTimeout(checkBusy, Math.max(ms, 1e3));
      }
    }
    checkBusy();
    return () => clearTimeout(timeoutId);
  });
}
const Busy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let busyState;
  let calendarId;
  let knownPerson;
  let isBusy;
  let $busyState, $$unsubscribe_busyState = noop, $$subscribe_busyState = () => ($$unsubscribe_busyState(), $$unsubscribe_busyState = subscribe(busyState, ($$value) => $busyState = $$value), busyState);
  let $isBusy, $$unsubscribe_isBusy = noop, $$subscribe_isBusy = () => ($$unsubscribe_isBusy(), $$unsubscribe_isBusy = subscribe(isBusy, ($$value) => $isBusy = $$value), isBusy);
  const { state } = getFrameContext();
  let freeBusyRanges = [];
  let error = "";
  $$result.css.add(css);
  $$subscribe_busyState(busyState = filterState("BUSY", state));
  calendarId = $busyState == null ? void 0 : $busyState.payload;
  knownPerson = calendarId ? knownPeople.get(calendarId) : void 0;
  {
    {
      if (calendarId) {
        fetchFreeBusy(calendarId).then((ranges) => {
          freeBusyRanges = ranges;
          error = "";
        }).catch((err) => {
          error = err;
        });
      }
    }
  }
  $$subscribe_isBusy(isBusy = isBusyInterval(freeBusyRanges));
  $$unsubscribe_busyState();
  $$unsubscribe_isBusy();
  return `<main class="${[
    "fill center svelte-vg30ut",
    ($isBusy.busy ? "busy" : "") + " " + (Boolean(error) ? "error" : "")
  ].join(" ").trim()}">${knownPerson ? `<img class="${"profile svelte-vg30ut"}" alt="${"Portrait of " + escape(knownPerson.name)}"${add_attribute("src", knownPerson.image, 0)} width="${"150"}" height="${"150"}">` : ``}
	<h1 class="${"headline-1"}">${escape($isBusy.busy ? "Busy" : "Free")}</h1>
	${$isBusy.next ? `<span>until ${validate_component(FormattedTime, "FormattedTime").$$render($$result, { time: $isBusy.next }, {}, {})}</span>` : ``}
	${error ? `<span>${escape(error)}</span>` : ``}
</main>`;
});
export { Busy as default, isBusyInterval };
