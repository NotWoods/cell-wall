import { c as create_ssr_component, s as subscribe, v as validate_component } from './ssr-966736c7.js';
import { r as readable } from './index2-505c6d08.js';
import { F as FormattedTime } from './FormattedTime-f6b71fa5.js';
import { f as filterState } from './filter-state-e2092dbc.js';
import { getFrameContext } from './_layout.svelte-bd8a7ccf.js';
import './state-socket-ab578445.js';
import './web-ec6e3b01.js';
import './random-c2405d3d.js';

const css = {
  code: "main.svelte-5srqaf{background:#1f1f1f;color:#c5eed0}.clock.svelte-5srqaf{text-align:center;font-size:72px;margin:8px}",
  map: null
};
function intervalClock() {
  return readable(/* @__PURE__ */ new Date(), (set) => {
    let timeout;
    function tick() {
      const now = /* @__PURE__ */ new Date();
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $time, $$unsubscribe_time;
  let $clockState, $$unsubscribe_clockState;
  const { state } = getFrameContext();
  const clockState = filterState("CLOCK", state);
  $$unsubscribe_clockState = subscribe(clockState, (value) => $clockState = value);
  const time = intervalClock();
  $$unsubscribe_time = subscribe(time, (value) => $time = value);
  $$result.css.add(css);
  $$unsubscribe_time();
  $$unsubscribe_clockState();
  return `<main class="fill center svelte-5srqaf"><h1 class="clock svelte-5srqaf">${validate_component(FormattedTime, "FormattedTime").$$render(
    $$result,
    {
      time: $time,
      timeZone: $clockState?.payload || void 0
    },
    {},
    {}
  )}</h1> </main>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-ee37b3c9.js.map
