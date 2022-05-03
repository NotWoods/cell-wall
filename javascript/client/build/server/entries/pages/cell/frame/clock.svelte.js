import { c as create_ssr_component, a as subscribe, v as validate_component, n as noop } from "../../../../chunks/index-07af9b00.js";
import { r as readable } from "../../../../chunks/web-9fac8a47.js";
import { F as FormattedTime } from "../../../../chunks/FormattedTime-1368929d.js";
import { f as filterState } from "../../../../chunks/filter-state-522a709a.js";
import { getFrameContext } from "./__layout.svelte.js";
import "../../../../chunks/state-socket-c39d2efa.js";
import "../../../../chunks/random-ca7fbb84.js";
var clock_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-5srqaf{background:#1f1f1f;color:#c5eed0}.clock.svelte-5srqaf{text-align:center;font-size:72px;margin:8px}",
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
  let time;
  let $time, $$unsubscribe_time = noop, $$subscribe_time = () => ($$unsubscribe_time(), $$unsubscribe_time = subscribe(time, ($$value) => $time = $$value), time);
  let $clockState, $$unsubscribe_clockState = noop, $$subscribe_clockState = () => ($$unsubscribe_clockState(), $$unsubscribe_clockState = subscribe(clockState, ($$value) => $clockState = $$value), clockState);
  const { state } = getFrameContext();
  $$result.css.add(css);
  $$subscribe_clockState(clockState = filterState("CLOCK", state));
  $$subscribe_time(time = intervalClock());
  $$unsubscribe_time();
  $$unsubscribe_clockState();
  return `<main class="${"fill center svelte-5srqaf"}"><h1 class="${"clock svelte-5srqaf"}">${validate_component(FormattedTime, "FormattedTime").$$render($$result, {
    time: $time,
    timeZone: ($clockState == null ? void 0 : $clockState.payload) || void 0
  }, {}, {})}</h1>
</main>`;
});
export { Clock as default };
