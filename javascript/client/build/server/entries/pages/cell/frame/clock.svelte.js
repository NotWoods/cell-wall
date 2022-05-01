import { c as create_ssr_component, a as subscribe, e as escape, n as noop } from "../../../../chunks/index-0b76d127.js";
import { r as readable } from "../../../../chunks/index-441a7cba.js";
import "../../../../chunks/web-9961d8d9.js";
import { f as filterState } from "../../../../chunks/index-cc0f756b.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-81af6fa4.js";
var clock_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-1nhto80{background:#1f1f1f;color:#c5eed0}h1.svelte-1nhto80{margin:8px}",
  map: null
};
function intervalClock() {
  return readable(new Date(), (set) => {
    let timeout;
    function tick() {
      const now = new Date();
      set(now);
      const nextMinute = new Date(now);
      nextMinute.setMilliseconds(0);
      nextMinute.setSeconds(0);
      nextMinute.setMinutes(now.getMinutes() + 1);
      const timeToNextMinuteMs = nextMinute.getTime() - now.getTime();
      timeout = setTimeout(tick, timeToNextMinuteMs);
    }
    tick();
    return () => clearTimeout(timeout);
  });
}
const Clock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let clockState;
  let timeZone;
  let formatter;
  let time;
  let $state, $$unsubscribe_state;
  let $time, $$unsubscribe_time = noop, $$subscribe_time = () => ($$unsubscribe_time(), $$unsubscribe_time = subscribe(time, ($$value) => $time = $$value), time);
  const { state } = getFrameContext();
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  $$result.css.add(css);
  clockState = filterState("CLOCK", $state);
  timeZone = clockState == null ? void 0 : clockState.payload;
  formatter = new Intl.DateTimeFormat(void 0, { timeStyle: "short", timeZone });
  $$subscribe_time(time = intervalClock());
  $$unsubscribe_state();
  $$unsubscribe_time();
  return `<main class="${"fill center svelte-1nhto80"}"><h1 class="${"headline-1 svelte-1nhto80"}">${escape(formatter.format($time))}</h1>
</main>`;
});
export { Clock as default };
