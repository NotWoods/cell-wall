var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { n as noop, d as safe_not_equal, a as subscribe, r as run_all, i as is_function } from "./index-07af9b00.js";
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}
const AXIS_TO_POS = (/* @__PURE__ */ new Map()).set("width", "x").set("height", "y");
function cellCanvas(cells) {
  const canvas = { x: Infinity, y: Infinity, width: 0, height: 0 };
  for (const info of cells) {
    for (const [axis, pos] of AXIS_TO_POS) {
      const value = info[pos] + info[axis];
      if (!Number.isNaN(value)) {
        canvas[pos] = Math.min(canvas[pos], info[pos]);
        canvas[axis] = Math.max(canvas[axis], info[pos] + info[axis]);
      }
    }
  }
  canvas.width = canvas.width - canvas.x;
  canvas.height = canvas.height - canvas.y;
  return canvas;
}
function buildSchema(options) {
  const { type, properties = {}, required = [] } = options;
  return {
    type: "object",
    properties: __spreadValues({
      type: {
        type: "string",
        const: type
      }
    }, properties),
    required: ["type", ...required]
  };
}
const blankState = Object.freeze({ type: "BLANK", payload: "" });
const cellStateBlankSchema = buildSchema({ type: "BLANK" });
const cellStateBusySchema = buildSchema({
  type: "BUSY",
  properties: {
    payload: { type: "string", title: "Calendar ID" }
  },
  required: ["payload"]
});
const cellStateClockSchema = buildSchema({
  type: "CLOCK",
  properties: {
    payload: { type: "string", title: "Time Zone" }
  }
});
const cellStateImageSchema = buildSchema({
  type: "IMAGE",
  properties: {
    payload: { type: "string", title: "Source", format: "uri" },
    scaleType: {
      type: "string",
      enum: ["FIT_CENTER", "FIT_XY", "CENTER_INSIDE"]
    }
  },
  required: ["payload"]
});
const cellStateTextSchema = buildSchema({
  type: "TEXT",
  properties: {
    payload: { type: "string", title: "Text" },
    backgroundColor: { type: "string" }
  },
  required: ["payload"]
});
const cellStateWebSchema = buildSchema({
  type: "WEB",
  properties: {
    payload: { type: "string", title: "URL", format: "uri" }
  },
  required: ["payload"]
});
export { cellStateBlankSchema as a, blankState as b, cellCanvas as c, derived as d, cellStateClockSchema as e, cellStateBusySchema as f, cellStateImageSchema as g, cellStateTextSchema as h, cellStateWebSchema as i, readable as r, writable as w };
