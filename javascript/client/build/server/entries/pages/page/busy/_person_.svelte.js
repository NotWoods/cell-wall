import { c as create_ssr_component, a as subscribe, e as escape } from "../../../../chunks/index-4d214b4e.js";
import { Temporal } from "@js-temporal/polyfill";
import { r as readable } from "../../../../chunks/index-23b4b723.js";
function convert(range) {
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
}
function isBusy(time, ranges) {
  for (const range of ranges) {
    const { start, end } = range;
    if (start && Temporal.ZonedDateTime.compare(time, start) < 0) {
      return { busy: false, next: range.start };
    } else if (!end || Temporal.ZonedDateTime.compare(time, end) <= 0) {
      return { busy: true, next: range.end };
    } else {
      continue;
    }
  }
  return { busy: false, next: void 0 };
}
function isBusyInterval(ranges) {
  return readable(false, (set) => {
    const dateTimeRanges = ranges.map(convert);
    function checkBusy() {
      const now = Temporal.Now.zonedDateTimeISO("UTC");
      const { busy, next } = isBusy(now, dateTimeRanges);
      set(busy);
      if (next) {
        const duration = now.until(next);
        console.log(`Waiting until ${duration}`);
        const ms = duration.total({ unit: "milliseconds" });
        setTimeout(checkBusy, Math.max(ms, 1e3));
      }
    }
    checkBusy();
  });
}
var _person__svelte_svelte_type_style_lang = "";
const css = {
  code: "body.svelte-8rd6l6{display:flex;flex-direction:column;justify-content:center}.profile.svelte-8rd6l6{display:block;border-radius:50%}",
  map: null
};
async function freebusy(request) {
  return await fetch("/api/third_party/freebusy", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
}
const people = {
  tiger: {
    name: "Tiger",
    image: "/assets/img/tiger.jpg",
    calendar: "tigeroakes@gmail.com"
  },
  daphne: {
    name: "Daphne",
    image: "/assets/img/daphne.jpg",
    calendar: "daphne.liu97@gmail.com"
  }
};
const states = {
  free: { text: "Free", background: "#262626" },
  busy: { text: "Busy", background: "#d87220" }
};
function isPerson(person) {
  return person in people;
}
const load = async ({ params }) => {
  const { person } = params;
  if (!isPerson(person)) {
    return {
      status: 404,
      error: new Error(`No matching data for ${person}`)
    };
  }
  const today = Temporal.Now.zonedDateTimeISO("UTC").startOfDay();
  const nextWeek = today.add({ days: 5 });
  const toStringOptions = {
    timeZoneName: "never",
    smallestUnit: "second"
  };
  const response = await freebusy({
    timeMin: today.toString(toStringOptions),
    timeMax: nextWeek.toString(toStringOptions),
    items: [{ id: people[person].calendar }]
  });
  if (!response.ok) {
    return {
      status: response.status,
      error: new Error(`Could not load calendar, ${response.statusText}`)
    };
  }
  const busy = await response.json();
  return {
    props: { person: people[person], busyRanges: busy }
  };
};
const U5Bpersonu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let state;
  let $isBusy, $$unsubscribe_isBusy;
  let { busyRanges } = $$props;
  let { person } = $$props;
  const isBusy2 = isBusyInterval(busyRanges);
  $$unsubscribe_isBusy = subscribe(isBusy2, (value) => $isBusy = value);
  if ($$props.busyRanges === void 0 && $$bindings.busyRanges && busyRanges !== void 0)
    $$bindings.busyRanges(busyRanges);
  if ($$props.person === void 0 && $$bindings.person && person !== void 0)
    $$bindings.person(person);
  $$result.css.add(css);
  state = states[$isBusy ? "busy" : "free"];
  $$unsubscribe_isBusy();
  return `<body style="${"background: " + escape(state.background)}" class="${"svelte-8rd6l6"}"><img class="${"profile svelte-8rd6l6"}" alt="${"Portrait of $" + escape(person.name)}" src="${"$" + escape(person.image)}" width="${"150"}" height="${"150"}">
	<h1 class="${"headline-1"}">${escape(state.text)}</h1>
</body>`;
});
export { U5Bpersonu5D as default, load };
