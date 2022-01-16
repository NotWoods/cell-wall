import { c as create_ssr_component, e as escape } from "../../../../chunks/index-50854321.js";
import { Temporal } from "@js-temporal/polyfill";
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
function isBusyInterval(ranges, callback) {
  const dateTimeRanges = ranges.map(convert);
  function checkBusy() {
    const now = Temporal.Now.zonedDateTimeISO("UTC");
    const { busy, next } = isBusy(now, dateTimeRanges);
    callback(busy);
    if (next) {
      const duration = now.until(next);
      console.log(`Waiting until ${duration}`);
      const ms = duration.total({ unit: "milliseconds" });
      setTimeout(checkBusy, Math.max(ms, 1e3));
    }
  }
  checkBusy();
}
var _person__svelte_svelte_type_style_lang = "";
const css = {
  code: "body.svelte-8rd6l6{display:flex;flex-direction:column;justify-content:center}.profile.svelte-8rd6l6{display:block;border-radius:50%}",
  map: null
};
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
  const body = {
    timeMin: today.toString(toStringOptions),
    timeMax: nextWeek.toString(toStringOptions),
    items: [{ id: people[person].calendar }]
  };
  const res = await fetch("/api/third_party/freebusy", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    return {
      status: res.status,
      error: new Error(`Could not load calendar, ${res.statusText}`)
    };
  }
  const busy = await res.json();
  return {
    props: { name: person, busyRanges: busy }
  };
};
const U5Bpersonu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let person;
  let state;
  let { busyRanges } = $$props;
  let { name } = $$props;
  let stateName = "free";
  isBusyInterval(busyRanges, (isBusy2) => {
    stateName = isBusy2 ? "busy" : "free";
  });
  if ($$props.busyRanges === void 0 && $$bindings.busyRanges && busyRanges !== void 0)
    $$bindings.busyRanges(busyRanges);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$result.css.add(css);
  person = people[name];
  state = states[stateName];
  return `<body style="${"background: " + escape(state.background)}" class="${"svelte-8rd6l6"}"><img class="${"profile svelte-8rd6l6"}" alt="${"Portrait of $" + escape(person.name)}" src="${"$" + escape(person.image)}" width="${"150"}" height="${"150"}">
	<h1 class="${"headline-1"}">${escape(state.text)}</h1>
</body>`;
});
export { U5Bpersonu5D as default, load };
