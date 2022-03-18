var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/env.ts
import { config } from "dotenv";
import { env, VERSION } from "@cell-wall/shared/src/env";
var SERVER_ADDRESS, PORT, PACKAGE_NAME, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_TOKEN, DATABASE_FILENAME;
var init_env = __esm({
  "src/lib/env.ts"() {
    config({ path: "../../.env" });
    ({
      SERVER_ADDRESS,
      PORT,
      PACKAGE_NAME,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GITHUB_TOKEN,
      DATABASE_FILENAME
    } = env(process.env));
  }
});

// ../../node_modules/.pnpm/svelte@3.46.4/node_modules/svelte/internal/index.mjs
function noop() {
}
function run(fn) {
  return fn();
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var resolved_promise, globals, SvelteElement;
var init_internal = __esm({
  "../../node_modules/.pnpm/svelte@3.46.4/node_modules/svelte/internal/index.mjs"() {
    resolved_promise = Promise.resolve();
    globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
    if (typeof HTMLElement === "function") {
      SvelteElement = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          const { on_mount } = this.$$;
          this.$$.on_disconnect = on_mount.map(run).filter(is_function);
          for (const key in this.$$.slotted) {
            this.appendChild(this.$$.slotted[key]);
          }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
          this[attr] = newValue;
        }
        disconnectedCallback() {
          run_all(this.$$.on_disconnect);
        }
        $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
        }
        $on(type, callback) {
          const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
          callbacks.push(callback);
          return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
              callbacks.splice(index, 1);
          };
        }
        $set($$props) {
          if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
          }
        }
      };
    }
  }
});

// ../../node_modules/.pnpm/svelte@3.46.4/node_modules/svelte/store/index.mjs
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
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
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
var subscriber_queue;
var init_store = __esm({
  "../../node_modules/.pnpm/svelte@3.46.4/node_modules/svelte/store/index.mjs"() {
    init_internal();
    init_internal();
    subscriber_queue = [];
  }
});

// src/lib/map/transform.ts
function transformMap(map, transform) {
  return new Map(Array.from(map.entries(), ([key, value]) => {
    return [key, transform(value, key)];
  }));
}
function filterMap(map, predicate) {
  return new Map(Array.from(map.entries()).filter(([key, value]) => predicate(value, key)));
}
async function transformMapAsync(map, transform) {
  return new Map(await Promise.all(Array.from(map.entries(), async ([key, value]) => {
    return [key, await transform(value, key)];
  })));
}
var init_transform = __esm({
  "src/lib/map/transform.ts"() {
  }
});

// src/lib/android/adb-action.ts
import { escapeShellArg } from "appium-adb/build/lib/helpers.js";
async function checkIfOn(adb, cmdOutput = void 0) {
  var _a;
  const stdout = cmdOutput || await adb.shell(["dumpsys", "power"]);
  const wakefulness = (_a = /mWakefulness=(\w+)/.exec(stdout)) == null ? void 0 : _a[1];
  return wakefulness === "Awake";
}
async function startIntent(adb, options) {
  const { waitForLaunch = true, flags = [], extras = {} } = options;
  const args = ["am", "start"];
  if (waitForLaunch) {
    args.push("-W");
  }
  if (options.action) {
    args.push("-a", options.action);
  }
  if (options.dataUri) {
    args.push("-d", escapeShellArg(options.dataUri.toString()));
  }
  if (options.mimeType) {
    args.push("-t", options.mimeType);
  }
  if (options.category) {
    args.push("-c", options.category);
  }
  if (options.component) {
    args.push("-n", options.component);
  }
  for (const flag of flags) {
    args.push("-f", flag);
  }
  for (const [key, extra] of Object.entries(extras)) {
    switch (typeof extra) {
      case "string":
        args.push("--es", key, extra);
        break;
      case "boolean":
        args.push("--ez", key, extra.toString());
        break;
      case "number":
        if (Number.isInteger(extra)) {
          args.push("--ei", key, extra.toString());
        } else {
          args.push("--ef", key, extra.toString());
        }
        break;
      case "object":
      case "undefined":
        if (extra == void 0) {
          args.push("--esn", key);
        } else if (Array.isArray(extra)) {
          const joined = extra.join(",");
          const flag = extra.every((n) => Number.isInteger(n)) ? "--eia" : "--efa";
          args.push(flag, key, joined);
        }
        break;
    }
  }
  let res;
  try {
    res = await adb.shell(args);
  } catch (err) {
    throw new StartIntentError(`Error attempting to start intent. Original error: ${err}`);
  }
  if (res.toLowerCase().includes("unable to resolve intent")) {
    throw new UnresolvedIntentError(res);
  }
}
var StartIntentError, UnresolvedIntentError;
var init_adb_action = __esm({
  "src/lib/android/adb-action.ts"() {
    StartIntentError = class extends Error {
      constructor() {
        super(...arguments);
        this.name = "StartIntentError";
      }
    };
    UnresolvedIntentError = class extends Error {
      constructor() {
        super(...arguments);
        this.name = "UnresolvedIntentError";
      }
    };
  }
});

// src/lib/android/device-manager.ts
import { ADB } from "appium-adb";
function noDeviceError(err) {
  return err instanceof Error && err.message.includes("Could not find a connected Android device");
}
var DeviceManager;
var init_device_manager = __esm({
  "src/lib/android/device-manager.ts"() {
    init_store();
    init_env();
    init_transform();
    init_adb_action();
    DeviceManager = class {
      constructor() {
        this._devices = writable(/* @__PURE__ */ new Map());
        this._devices.subscribe((map) => {
          this._lastMap = map;
        });
      }
      subscribe(run2, invalidate) {
        return this._devices.subscribe(run2, invalidate);
      }
      async refreshDevices() {
        const adbGlobal = await ADB.createADB({
          allowOfflineDevices: process.env["NODE_ENV"] !== "production"
        });
        let devices;
        try {
          devices = await adbGlobal.getDevicesWithRetry();
        } catch (err) {
          if (noDeviceError(err)) {
            devices = [];
          } else {
            throw err;
          }
        }
        const clients = await Promise.all(devices.map(async (device) => {
          const adb = await ADB.createADB();
          adb.setDevice(device);
          const [model, manufacturer] = await Promise.all([adb.getModel(), adb.getManufacturer()]);
          const adbDevice = {
            adb,
            model,
            manufacturer
          };
          return [device.udid, adbDevice];
        }));
        const result = new Map(clients);
        this._devices.set(result);
        return result;
      }
      async installApkToAll(path, pkg) {
        return transformMapAsync(this._lastMap, ({ adb }) => adb.installOrUpgrade(path, pkg, {
          enforceCurrentBuild: true
        }));
      }
      async run(serial, action) {
        const { adb } = this._lastMap.get(serial) ?? {};
        if (!adb)
          return false;
        return action(adb);
      }
      async checkIfOn(serial) {
        return this.run(serial, checkIfOn);
      }
      async togglePower(serial) {
        return this.run(serial, async (adb) => {
          await adb.cycleWakeUp();
          return true;
        });
      }
      async startIntent(serial, options) {
        return this.run(serial, async (adb) => {
          try {
            await startIntent(adb, options);
            return true;
          } catch (err) {
            console.warn(err);
            return false;
          }
        });
      }
      async connectPort(serial, devicePort) {
        return this.run(serial, async (adb) => {
          await adb.reversePort(devicePort, PORT);
          return true;
        });
      }
    };
  }
});

// src/lib/android/power.ts
function asPower(primitive) {
  switch (primitive) {
    case "toggle":
    case true:
    case false:
      return primitive;
    case "true":
    case "false":
      return Boolean(primitive);
    default:
      return void 0;
  }
}
async function setPowerOne(client, on) {
  const isOn = await checkIfOn(client);
  if (isOn !== on) {
    if (on === false) {
      await client.keyevent(KEYCODE_POWER);
    } else {
      await client.cycleWakeUp();
    }
    return !isOn;
  }
  return on;
}
async function setPower(device, on) {
  if (device instanceof Map) {
    const devices = device;
    let allOn;
    if (on === "toggle") {
      const powerStates = await Promise.all(Array.from(devices.values()).map(async ({ adb: client }) => ({
        on: await checkIfOn(client),
        client
      })));
      const numOn = powerStates.filter((state) => state.on).length;
      const numOff = powerStates.length - numOn;
      allOn = numOn < numOff;
    } else {
      allOn = on;
    }
    await Promise.all(Array.from(devices.values()).map(({ adb: client }) => setPowerOne(client, allOn)));
    return allOn;
  } else {
    return await setPowerOne(device);
  }
}
var KEYCODE_POWER;
var init_power = __esm({
  "src/lib/android/power.ts"() {
    init_adb_action();
    KEYCODE_POWER = 26;
  }
});

// src/lib/cells/manager.ts
var CellManager;
var init_manager = __esm({
  "src/lib/cells/manager.ts"() {
    init_store();
    CellManager = class {
      constructor() {
        this._info = writable(/* @__PURE__ */ new Map());
      }
      get info() {
        return this._info;
      }
      subscribe(run2, invalidate) {
        return this._info.subscribe(run2, invalidate);
      }
      async loadInfo(db) {
        try {
          const cells = await db.getCells();
          this._info.update((map) => {
            const newMap = new Map(map);
            for (const cell of cells) {
              newMap.set(cell.serial, cell);
            }
            return newMap;
          });
        } catch (err) {
          console.error("Could not load CellManager data", err);
        }
        return this;
      }
      async writeInfo(db) {
        await db.insertCells(Array.from(get_store_value(this._info).values()));
      }
      register(serial, info) {
        this._info.update((map) => new Map(map).set(serial, info));
      }
      registerServer(serial, server) {
        this._info.update((map) => {
          const info = map.get(serial);
          if (info) {
            return new Map(map).set(serial, __spreadProps(__spreadValues({}, info), { server }));
          } else {
            return map;
          }
        });
      }
    };
  }
});

// src/lib/cells/state.ts
function cellStateStore() {
  const store = writable(/* @__PURE__ */ new Map());
  return __spreadProps(__spreadValues({}, store), {
    setStates(states) {
      const entries = typeof states.entries === "function" ? states.entries() : Object.entries(states);
      store.update((map) => new Map([...map, ...entries]));
    }
  });
}
function cellStateFor(store, serial) {
  return derived(store, (map) => map.get(serial));
}
function toUri(state, base = SERVER_ADDRESS) {
  const _a = state, { type } = _a, props = __objRest(_a, ["type"]);
  switch (type.toUpperCase()) {
    case "WEB": {
      const web = props;
      return new URL(web.payload, base);
    }
    case "IMAGE": {
      const imgProps = props;
      if (typeof imgProps.payload === "string") {
        imgProps.payload = new URL(imgProps.payload, base).toString();
      }
    }
    default: {
      const url = new URL(`cellwall://${type}`);
      for (const [key, value] of Object.entries(props)) {
        url.searchParams.append(key, value);
      }
      return url;
    }
  }
}
var init_state = __esm({
  "src/lib/cells/state.ts"() {
    init_store();
    init_env();
  }
});

// src/lib/cells/index.ts
var init_cells = __esm({
  "src/lib/cells/index.ts"() {
    init_manager();
    init_state();
  }
});

// src/lib/cells/canvas.ts
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
function shiftCell(canvas, cell) {
  const copy = __spreadValues({}, cell);
  copy.x = cell.x - canvas.x;
  copy.y = cell.y - canvas.y;
  return copy;
}
var AXIS_TO_POS;
var init_canvas = __esm({
  "src/lib/cells/canvas.ts"() {
    AXIS_TO_POS = (/* @__PURE__ */ new Map()).set("width", "x").set("height", "y");
  }
});

// src/lib/image/manipulate.ts
import Jimp from "jimp";
import { setHas } from "ts-extras";
function parseResizeOptions(query = {}) {
  const horizontalFlag = ALIGN_QUERY[query.horizontalAlign] || 0;
  const verticalFlag = ALIGN_QUERY[query.verticalAlign] || 0;
  const resize2 = setHas(RESIZE, query.resize) ? query.resize : void 0;
  return {
    alignBits: horizontalFlag | verticalFlag,
    resizeMode: resize2
  };
}
function resize(image, { width, height }, query = {}) {
  const { alignBits, resizeMode } = parseResizeOptions(query);
  return new Promise((resolve, reject) => image.cover(width, height, alignBits, resizeMode, (err, value) => {
    if (err)
      reject(err);
    else
      resolve(value);
  }));
}
function crop(image, cell) {
  return new Promise((resolve, reject) => image.crop(cell.x, cell.y, cell.width, cell.height, (err, value) => {
    if (err)
      reject(err);
    else
      resolve(value);
  }));
}
var ALIGN_QUERY, RESIZE;
var init_manipulate = __esm({
  "src/lib/image/manipulate.ts"() {
    ALIGN_QUERY = {
      left: Jimp.HORIZONTAL_ALIGN_LEFT,
      right: Jimp.HORIZONTAL_ALIGN_RIGHT,
      center: Jimp.HORIZONTAL_ALIGN_CENTER,
      top: Jimp.VERTICAL_ALIGN_TOP,
      bottom: Jimp.VERTICAL_ALIGN_BOTTOM,
      middle: Jimp.VERTICAL_ALIGN_MIDDLE
    };
    RESIZE = /* @__PURE__ */ new Set([
      Jimp.RESIZE_NEAREST_NEIGHBOR,
      Jimp.RESIZE_BILINEAR,
      Jimp.RESIZE_BICUBIC,
      Jimp.RESIZE_HERMITE,
      Jimp.RESIZE_BEZIER
    ]);
  }
});

// src/lib/image/split.ts
import Jimp2 from "jimp";
async function splitImage(image, cells, options = {}) {
  const canvas = cellCanvas(cells.values());
  await resize(image, canvas, options);
  return await transformMapAsync(cells, async (info) => {
    const copy = await Jimp2.create(image);
    const shifted = shiftCell(canvas, info);
    return {
      info: shifted,
      img: await crop(copy, shifted)
    };
  });
}
var init_split = __esm({
  "src/lib/image/split.ts"() {
    init_canvas();
    init_transform();
    init_manipulate();
  }
});

// src/lib/image/cache.ts
var SplitImageCache;
var init_cache = __esm({
  "src/lib/image/cache.ts"() {
    init_transform();
    init_split();
    SplitImageCache = class {
      constructor() {
        this.cache = /* @__PURE__ */ new Map();
      }
      get(serial) {
        return this.cache.get(serial);
      }
      clear() {
        this.cache.clear();
      }
      async insert(image, rects, options) {
        const cropped = await splitImage(image, rects, options);
        this.clear();
        return transformMap(cropped, ({ info, img }, serial) => {
          this.cache.set(serial, img);
          return info;
        });
      }
    };
  }
});

// src/lib/map/get.ts
function asArray(items) {
  return Array.isArray(items) ? items : [items];
}
function getAll(map, keys) {
  const result = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const value = map.get(key);
    if (value !== void 0) {
      result.set(key, value);
    }
  }
  return result;
}
var init_get = __esm({
  "src/lib/map/get.ts"() {
  }
});

// src/lib/map/subscribe.ts
function subscribeToMapStore(store, subscription) {
  let oldMap;
  return store.subscribe((newMap) => {
    subscription(newMap, oldMap);
    oldMap = newMap;
  });
}
var init_subscribe = __esm({
  "src/lib/map/subscribe.ts"() {
  }
});

// src/lib/repository/known.ts
function computeInfo(model, manufacturer) {
  const known = knownDevices.find((device) => device.model === model && device.manufacturer === manufacturer);
  const autoDeviceName = model.startsWith(manufacturer) || manufacturer.toLowerCase() === "android" ? model : `${manufacturer} ${model}`;
  if (known) {
    return {
      deviceName: known.deviceName || autoDeviceName,
      width: known.width,
      height: known.height
    };
  } else {
    return {
      deviceName: autoDeviceName
    };
  }
}
var knownDevices;
var init_known = __esm({
  "src/lib/repository/known.ts"() {
    knownDevices = [
      {
        model: "A0001",
        manufacturer: "OnePlus",
        deviceName: "OnePlus One",
        width: 470,
        height: 835
      },
      {
        model: "Amazon OtterX",
        manufacturer: "android",
        deviceName: "Amazon Kindle",
        width: 1024,
        height: 552
      },
      {
        model: "XT1034",
        manufacturer: "motorola",
        deviceName: "Moto G XT1034",
        width: 598,
        height: 360
      },
      {
        model: "A600",
        manufacturer: "Polaroid",
        deviceName: "Polaroid A600",
        width: 470,
        height: 835
      }
    ];
  }
});

// src/lib/repository/combine-cell.ts
function deriveCellInfo(stores) {
  let lastResult = /* @__PURE__ */ new Map();
  return derived([stores.info, stores.devices, stores.webSockets], ([infoMap, devices, webSockets]) => {
    const cellInfoMap = /* @__PURE__ */ new Map();
    function mergeFrom(otherMap, getCellInfo) {
      for (const [serial, otherData] of otherMap) {
        const existing = cellInfoMap.get(serial) ?? {};
        const newData = __spreadValues(__spreadValues({
          serial
        }, existing), getCellInfo(otherData));
        cellInfoMap.set(serial, newData);
      }
    }
    mergeFrom(infoMap, (info) => info);
    mergeFrom(webSockets, (socketInfo) => ({
      width: socketInfo.width,
      height: socketInfo.height
    }));
    mergeFrom(devices, ({ model, manufacturer }) => computeInfo(model, manufacturer));
    for (const [serial, newInfo] of cellInfoMap) {
      const lastInfo = lastResult.get(serial);
      if (lastInfo && lastInfo.deviceName === newInfo.deviceName && lastInfo.width === newInfo.width && lastInfo.height === newInfo.height && lastInfo.x === newInfo.x && lastInfo.y === newInfo.y && lastInfo.server === newInfo.server) {
        cellInfoMap.set(serial, lastInfo);
      }
    }
    lastResult = cellInfoMap;
    return lastResult;
  });
}
function deriveConnection(stores) {
  return derived([stores.devices, stores.webSockets], ([devices, webSockets]) => {
    const connections = /* @__PURE__ */ new Map();
    for (const id of webSockets.keys()) {
      connections.set(id, "web");
    }
    for (const serial of devices.keys()) {
      connections.set(serial, "android");
    }
    return connections;
  });
}
function deriveCellData(stores) {
  const cellInfo = deriveCellInfo(stores);
  const connections = deriveConnection(stores);
  let lastResult = /* @__PURE__ */ new Map();
  return derived([stores.state, cellInfo, connections], ([stateMap, infoMap, connectionMap]) => {
    const keys = /* @__PURE__ */ new Set([...stateMap.keys(), ...infoMap.keys(), ...connectionMap.keys()]);
    const result = /* @__PURE__ */ new Map();
    for (const serial of keys) {
      const oldData = lastResult.get(serial);
      const newData = {
        serial,
        info: infoMap.get(serial),
        state: stateMap.get(serial),
        connection: connectionMap.get(serial)
      };
      if (oldData && newData.info === oldData.info && newData.state === oldData.state && newData.connection === oldData.connection) {
        result.set(serial, oldData);
      } else {
        result.set(serial, newData);
      }
    }
    lastResult = result;
    return lastResult;
  });
}
var init_combine_cell = __esm({
  "src/lib/repository/combine-cell.ts"() {
    init_store();
    init_known();
  }
});

// src/lib/repository/database.ts
import { JSONFile, Low, Memory } from "lowdb";
async function database(filename) {
  const adapter = filename ? new JSONFile(filename) : new Memory();
  const db = new Low(adapter);
  await db.read();
  function initData() {
    return db.data ||= { cells: {} };
  }
  return {
    async getGoogleCredentials() {
      var _a;
      return (_a = db.data) == null ? void 0 : _a.googleCredentials;
    },
    async setGoogleCredentials(credentials) {
      initData().googleCredentials = credentials;
      await db.write();
    },
    async getCell(name) {
      var _a, _b;
      return (_b = (_a = db.data) == null ? void 0 : _a.cells) == null ? void 0 : _b[name];
    },
    async getCells() {
      return Object.values(initData().cells);
    },
    async insertCell(cell) {
      initData().cells[cell.serial] = cell;
      await db.write();
    },
    async insertCells(cells) {
      const data = initData();
      for (const cell of cells) {
        data.cells[cell.serial] = cell;
      }
      await db.write();
    }
  };
}
var init_database = __esm({
  "src/lib/repository/database.ts"() {
  }
});

// src/lib/repository/socket-store.ts
function webSocketStore() {
  const store = writable(/* @__PURE__ */ new Map());
  return __spreadProps(__spreadValues({}, store), {
    add(serial, socket) {
      store.update((map) => new Map(map).set(serial, socket));
    },
    delete(serial) {
      store.update((map) => {
        const copy = new Map(map);
        copy.delete(serial);
        return copy;
      });
    }
  });
}
var init_socket_store = __esm({
  "src/lib/repository/socket-store.ts"() {
    init_store();
  }
});

// src/lib/repository/third-party-connect/github.ts
import { memo } from "@cell-wall/shared";
import { Octokit } from "@octokit/core";
import { createWriteStream, promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
var buildTempDir, GithubClient;
var init_github = __esm({
  "src/lib/repository/third-party-connect/github.ts"() {
    init_env();
    buildTempDir = memo(() => fs.mkdtemp(join(tmpdir(), "apk-")));
    GithubClient = class {
      constructor() {
        if (!GITHUB_TOKEN) {
          throw new Error(`Missing GitHub API keys`);
        }
        this.octokit = new Octokit({ auth: GITHUB_TOKEN });
      }
      fetchRelease(tag) {
        if (tag) {
          return this.octokit.request("GET /repos/{owner}/{repo}/releases/tags/{tag}", {
            owner: "NotWooods",
            repo: "cell-wall",
            tag
          });
        } else {
          return this.octokit.request("GET /repos/{owner}/{repo}/releases/latest", {
            owner: "NotWooods",
            repo: "cell-wall"
          });
        }
      }
      async downloadApk(tag) {
        const tmpDirReady = buildTempDir();
        const response = await this.fetchRelease(tag);
        const release = response.data;
        const asset = release.assets.find((asset2) => asset2.name.endsWith(".apk"));
        if (asset) {
          const res = await fetch(asset.browser_download_url);
          const tmpDirPath = await tmpDirReady;
          const destPath = join(tmpDirPath, asset.name);
          await pipeline(res.body, createWriteStream(destPath));
          return destPath;
        } else {
          throw new Error(`Could not find APK attached to release ${release.tag_name}`);
        }
      }
    };
  }
});

// src/lib/repository/third-party-connect/google.ts
import { auth, calendar } from "@googleapis/calendar";
var GoogleClient;
var init_google = __esm({
  "src/lib/repository/third-party-connect/google.ts"() {
    init_store();
    init_env();
    GoogleClient = class {
      constructor(db, credentials) {
        this.db = db;
        this.client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "https://cellwall.tigeroakes.com/oauth2callback");
        if (credentials) {
          this.authUrl = writable(void 0);
          this.client.setCredentials(credentials);
        } else {
          const authorizeUrl = this.client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/calendar.readonly"]
          });
          this.authUrl = writable(authorizeUrl);
        }
      }
      static async create(dbPromise) {
        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
          throw new Error(`Missing Google API keys`);
        }
        const db = await dbPromise;
        const credentials = await db.getGoogleCredentials();
        return new GoogleClient(db, credentials);
      }
      get authorizeUrl() {
        return this.authUrl;
      }
      async authenticate(code) {
        const res = await this.client.getToken(code);
        this.authUrl.set(void 0);
        this.client.setCredentials(res.tokens);
        try {
          await this.db.setGoogleCredentials(res.tokens);
        } catch {
        }
      }
      async freebusy(params) {
        const api = calendar({ version: "v3", auth: this.client });
        return await api.freebusy.query(params);
      }
    };
  }
});

// src/lib/repository/third-party-connect/index.ts
function thirdPartyConnectRepository(dbPromise) {
  let github;
  let google;
  return {
    get github() {
      if (!github) {
        github = new GithubClient();
      }
      return github;
    },
    get google() {
      if (!google) {
        google = GoogleClient.create(dbPromise);
      }
      return google;
    }
  };
}
var init_third_party_connect = __esm({
  "src/lib/repository/third-party-connect/index.ts"() {
    init_github();
    init_google();
  }
});

// src/lib/repository/repository.ts
function sendIntentOnStateChange(stores, deviceManager) {
  subscribeToMapStore(stores.state, (newStates, oldStates) => {
    const changes = new Map(newStates);
    if (oldStates) {
      for (const [serial, state] of oldStates) {
        if (changes.get(serial) === state) {
          changes.delete(serial);
        }
      }
    }
    const info = get_store_value(stores.info);
    Promise.all(Array.from(changes).map(([serial, state]) => {
      var _a;
      console.log(serial, state);
      const base = ((_a = info.get(serial)) == null ? void 0 : _a.server) || SERVER_ADDRESS;
      return deviceManager.startIntent(serial, {
        action: `${PACKAGE_NAME}.DISPLAY`,
        dataUri: toUri(state, base),
        waitForLaunch: true
      });
    }));
  });
}
function repository() {
  const dbPromise = database(DATABASE_FILENAME);
  const cellState = cellStateStore();
  const webSockets = webSocketStore();
  const deviceManager = new DeviceManager();
  let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
  const cellManager = new CellManager();
  const cellManagerPromise = dbPromise.then((db) => cellManager.loadInfo(db));
  sendIntentOnStateChange({ info: cellManager, state: cellState }, deviceManager);
  const cellData = deriveCellData({
    info: cellManager,
    state: cellState,
    devices: deviceManager,
    webSockets
  });
  cellData.subscribe((state) => console.info("CellData", state));
  const thirdParty = thirdPartyConnectRepository(dbPromise);
  return {
    cellData,
    cellState,
    images: new SplitImageCache(),
    webSockets,
    thirdParty,
    refreshDevices() {
      const refreshPromise = deviceManager.refreshDevices();
      deviceManagerPromise = refreshPromise.then(() => deviceManager);
      return refreshPromise;
    },
    async installApk(tag) {
      const apkPath = await thirdParty.github.downloadApk(tag);
      if (apkPath) {
        return await deviceManager.installApkToAll(apkPath, PACKAGE_NAME);
      } else {
        return /* @__PURE__ */ new Map();
      }
    },
    async connectDevicePort(serial, port) {
      const deviceManager2 = await deviceManagerPromise;
      if (await deviceManager2.connectPort(serial, port)) {
        const cellManager2 = await cellManagerPromise;
        cellManager2.registerServer(serial, `http://localhost:${port}`);
        const db = await dbPromise;
        await cellManager2.writeInfo(db);
        return true;
      } else {
        return false;
      }
    },
    async getPower(serial) {
      const deviceManager2 = await deviceManagerPromise;
      return deviceManager2.checkIfOn(serial);
    },
    async setPower(serial, on) {
      const deviceManager2 = await deviceManagerPromise;
      const devices = get_store_value(deviceManager2);
      const serialList = asArray(serial);
      return setPower(getAll(devices, serialList), on);
    },
    async registerCell(info) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.register(info.serial, info);
      const db = await dbPromise;
      await cellManager2.writeInfo(db);
    }
  };
}
var init_repository = __esm({
  "src/lib/repository/repository.ts"() {
    init_store();
    init_device_manager();
    init_power();
    init_cells();
    init_env();
    init_cache();
    init_get();
    init_subscribe();
    init_combine_cell();
    init_database();
    init_socket_store();
    init_third_party_connect();
  }
});

// src/lib/repository/interface.ts
var init_interface = __esm({
  "src/lib/repository/interface.ts"() {
  }
});

// src/lib/repository/index.ts
var repo;
var init_repository2 = __esm({
  "src/lib/repository/index.ts"() {
    init_repository();
    init_interface();
    repo = repository();
  }
});

// src/routes/api/action/image/[serial].ts
var serial_exports = {};
__export(serial_exports, {
  default: () => serial_default
});
async function serial_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/action/image/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      const cached = repo.images.get(serial);
      if (!cached) {
        reply.status(404);
        return;
      }
      const mime = cached.getMIME();
      const buffer = await cached.getBufferAsync(mime);
      reply.status(200).header("content-type", mime).send(buffer);
    }
  });
}
var init_serial = __esm({
  "src/routes/api/action/image/[serial].ts"() {
    init_repository2();
  }
});

// src/lib/image/rect.ts
function isNumber(number) {
  return typeof number === "number" && !Number.isNaN(number);
}
function validRect(rect = {}) {
  return isNumber(rect.x) && isNumber(rect.y) && isNumber(rect.width) && isNumber(rect.height);
}
var init_rect = __esm({
  "src/lib/image/rect.ts"() {
  }
});

// src/lib/image/index.ts
var init_image = __esm({
  "src/lib/image/index.ts"() {
    init_cache();
    init_manipulate();
    init_rect();
    init_split();
  }
});

// src/parser/image.ts
async function defaultJimp() {
  const module = await import("jimp");
  return module.default;
}
async function imagePlugin(fastify, options = {}) {
  const jimp = await (options.jimp ?? defaultJimp());
  async function contentParser(_request, body) {
    return await jimp.create(body);
  }
  for (const mimeType of Object.keys(jimp.decoders)) {
    fastify.addContentTypeParser(mimeType, { parseAs: "buffer", bodyLimit: 10 * MB }, contentParser);
  }
}
var MB;
var init_image2 = __esm({
  "src/parser/image.ts"() {
    MB = 1048576;
  }
});

// src/routes/api/action/image/index.ts
var image_exports = {};
__export(image_exports, {
  default: () => image_default
});
import { blankState } from "@cell-wall/shared";
async function updateRemainingCells(remaining, behaviour) {
  switch (behaviour) {
    case "blank":
      repo.cellState.setStates(new Map(remaining.map((serial) => [serial, blankState])));
      break;
    case "off":
      await repo.setPower(remaining, false);
      break;
    case "ignore":
      break;
  }
}
async function image_default(fastify) {
  await imagePlugin(fastify);
  fastify.route({
    method: "POST",
    url: "/api/action/image/",
    schema: {
      querystring: {
        type: "object",
        properties: {
          horizontalAlign: {
            type: "string",
            enum: ["left", "center", "right"]
          },
          verticalAlign: {
            type: "string",
            enum: ["top", "middle", "bottom"]
          },
          resize: {
            type: "string",
            enum: Array.from(RESIZE)
          },
          rest: {
            type: "string",
            enum: ["ignore", "blank", "off"]
          }
        }
      }
    },
    async handler(request, reply) {
      const image = request.body;
      const devices = new Set(Array.isArray(request.query.device) ? request.query.device : [request.query.device]);
      const includes = devices.size > 0 ? devices.has.bind(devices) : () => true;
      const cellData = get_store_value(repo.cellData);
      const cells = filterMap(cellData, (cell) => validRect(cell.info) && includes(cell.serial));
      const rects = transformMap(cells, (cell) => {
        var _a, _b, _c, _d;
        return {
          width: ((_a = cell.info) == null ? void 0 : _a.width) ?? 1,
          height: ((_b = cell.info) == null ? void 0 : _b.height) ?? 1,
          x: ((_c = cell.info) == null ? void 0 : _c.x) ?? 0,
          y: ((_d = cell.info) == null ? void 0 : _d.y) ?? 0
        };
      });
      const options = {
        horizontalAlign: request.query.horizontalAlign,
        verticalAlign: request.query.verticalAlign,
        resize: request.query.resize
      };
      repo.images.clear();
      await repo.images.insert(image, rects, options);
      repo.cellState.setStates(await transformMapAsync(rects, async (_, serial) => {
        const buffer = await repo.images.get(serial).getBufferAsync(image.getMIME());
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        return {
          type: "IMAGE",
          payload: arrayBuffer
        };
      }));
      if (request.query.rest) {
        const remaining = Array.from(cellData.keys()).filter((serial) => !rects.has(serial));
        const rest = request.query.rest;
        await updateRemainingCells(remaining, rest ?? "ignore");
      }
      reply.send(Array.from(rects.keys()));
    }
  });
  fastify.route({
    method: "DELETE",
    url: "/api/action/image/",
    async handler(_request, reply) {
      repo.images.clear();
      reply.status(201).send();
    }
  });
}
var init_image3 = __esm({
  "src/routes/api/action/image/index.ts"() {
    init_store();
    init_image();
    init_transform();
    init_repository2();
    init_image2();
  }
});

// src/routes/api/action/install.ts
var install_exports = {};
__export(install_exports, {
  default: () => install_default
});
async function install_default(fastify) {
  fastify.route({
    method: "POST",
    url: "/api/action/install",
    schema: {
      response: {
        200: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              wasUninstalled: { type: "boolean" },
              appState: { type: "string" }
            }
          }
        }
      }
    },
    async handler(request, reply) {
      const results = await repo.installApk(request.body.get("tag") ?? void 0);
      reply.send(Object.fromEntries(results));
    }
  });
}
var init_install = __esm({
  "src/routes/api/action/install.ts"() {
    init_repository2();
  }
});

// src/routes/api/action/refresh.ts
var refresh_exports = {};
__export(refresh_exports, {
  default: () => refresh_default
});
async function refresh_default(fastify) {
  fastify.route({
    method: ["GET", "POST"],
    url: "/api/action/refresh",
    async handler(request, reply) {
      const devices = await repo.refreshDevices();
      reply.send(Object.fromEntries(transformMap(devices, (device) => ({
        model: device.model,
        manufacturer: device.manufacturer
      }))));
    }
  });
}
var init_refresh = __esm({
  "src/routes/api/action/refresh.ts"() {
    init_transform();
    init_repository2();
  }
});

// src/lib/color.ts
var RAINBOW_COLORS, RandomColor;
var init_color = __esm({
  "src/lib/color.ts"() {
    RAINBOW_COLORS = [
      "#0F172A",
      "#7F1D1D",
      "#7C2D12",
      "#78350F",
      "#713F12",
      "#365314",
      "#14532D",
      "#064E3B",
      "#134E4A",
      "#164E63",
      "#0C4A6E",
      "#1E3A8A",
      "#312E81",
      "#4C1D95",
      "#581C87",
      "#701A75",
      "#831843",
      "#881337"
    ];
    RandomColor = class {
      constructor(colors = RAINBOW_COLORS) {
        this.colors = colors;
        if (colors.length === 0) {
          throw new TypeError("No colors provided");
        }
        this.reset();
      }
      reset() {
        this.unusedColors = this.colors.slice();
      }
      next() {
        const randomIndex = Math.floor(Math.random() * this.unusedColors.length);
        const color = this.unusedColors[randomIndex];
        this.unusedColors.splice(randomIndex, 1);
        if (this.unusedColors.length === 0) {
          this.reset();
        }
        return color;
      }
    };
  }
});

// src/routes/api/action/text.ts
var text_exports = {};
__export(text_exports, {
  default: () => text_default
});
import { textState } from "@cell-wall/shared";
async function text_default(fastify) {
  fastify.route({
    method: "POST",
    url: "/api/action/text",
    async handler(request, reply) {
      const lines = typeof request.body === "string" ? request.body.split(/\s*\n\s*/g) : request.body;
      const devices = Array.from(get_store_value(repo.cellData).values()).sort((a, b) => {
        var _a, _b;
        return (((_a = b.info) == null ? void 0 : _a.width) ?? 0) - (((_b = a.info) == null ? void 0 : _b.width) ?? 0);
      });
      const deviceToText = new Map(devices.map((device) => [device.serial, []]));
      for (const [i, line] of lines.entries()) {
        const index = i % devices.length;
        const device = devices[index];
        deviceToText.get(device.serial).push(line);
      }
      const colors = new RandomColor();
      const states = transformMap(deviceToText, (lines2) => textState(lines2.join(", "), request.query.backgroundColor ?? colors.next()));
      repo.cellState.setStates(states);
      reply.send(Object.fromEntries(states));
    }
  });
}
var init_text = __esm({
  "src/routes/api/action/text.ts"() {
    init_store();
    init_color();
    init_transform();
    init_repository2();
  }
});

// src/routes/api/device/power/_body.ts
function parsePowerBody(body) {
  if (typeof body === "boolean" || typeof body === "string") {
    return asPower(body);
  } else if (typeof body === "object" && body !== null) {
    if (body instanceof URLSearchParams) {
      return asPower(body.get("on"));
    } else {
      const { on } = body;
      return asPower(on);
    }
  }
  return void 0;
}
var init_body = __esm({
  "src/routes/api/device/power/_body.ts"() {
    init_power();
  }
});

// src/routes/api/device/power/[serial].ts
var serial_exports2 = {};
__export(serial_exports2, {
  default: () => serial_default2
});
async function serial_default2(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/power/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      reply.send({
        [serial]: await repo.getPower(serial)
      });
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/power/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      const power = parsePowerBody(request.body);
      if (power === void 0) {
        reply.status(400).send(new Error(`Invalid body ${request.body}`));
        return;
      }
      reply.send(await repo.setPower(serial, power));
    }
  });
}
var init_serial2 = __esm({
  "src/routes/api/device/power/[serial].ts"() {
    init_repository2();
    init_body();
  }
});

// src/routes/api/device/power/index.ts
var power_exports = {};
__export(power_exports, {
  default: () => power_default
});
async function power_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/power/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(await transformMapAsync(get_store_value(repo.cellData), (_data, serial) => repo.getPower(serial))));
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/power/",
    async handler(request, reply) {
      const power = parsePowerBody(request.body);
      if (power === void 0) {
        reply.status(400).send(new Error(`Invalid body ${request.body}`));
        return;
      }
      const serials = Array.from(get_store_value(repo.cellData).keys());
      reply.send(await repo.setPower(serials, power));
    }
  });
}
var init_power2 = __esm({
  "src/routes/api/device/power/index.ts"() {
    init_store();
    init_transform();
    init_repository2();
    init_body();
  }
});

// src/routes/api/device/state/_body.ts
import { cellStateTypes } from "@cell-wall/shared";
import { setHas as setHas2 } from "ts-extras";
function isObject(maybe) {
  return typeof maybe === "object" && maybe !== null;
}
function asCellState(maybeState) {
  if (isObject(maybeState)) {
    const state = maybeState;
    if (setHas2(cellStateTypes, state.type)) {
      return state;
    }
  }
  return void 0;
}
var init_body2 = __esm({
  "src/routes/api/device/state/_body.ts"() {
  }
});

// src/routes/api/device/state/[serial].ts
var serial_exports3 = {};
__export(serial_exports3, {
  default: () => serial_default3
});
import { blankState as blankState2 } from "@cell-wall/shared";
async function serial_default3(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/state/:serial",
    async handler(request, reply) {
      var _a;
      const { serial } = request.params;
      reply.send({
        [serial]: ((_a = get_store_value(repo.cellData).get(serial)) == null ? void 0 : _a.state) ?? blankState2
      });
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/state/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      const state = asCellState(request.body instanceof URLSearchParams ? Object.fromEntries(request.body) : request.body);
      if (!state) {
        reply.status(400).send(new Error(`Invalid body ${request.body}`));
        return;
      }
      repo.cellState.setStates((/* @__PURE__ */ new Map()).set(serial, state));
      reply.send([serial]);
    }
  });
}
var init_serial3 = __esm({
  "src/routes/api/device/state/[serial].ts"() {
    init_store();
    init_repository2();
    init_body2();
  }
});

// src/routes/api/device/state/index.ts
var state_exports = {};
__export(state_exports, {
  default: () => state_default
});
import { blankState as blankState3 } from "@cell-wall/shared";
async function state_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/state/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(transformMap(get_store_value(repo.cellData), (data) => data.state ?? blankState3)));
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/state/",
    async handler(request, reply) {
      const singleState = asCellState(request.body);
      let states;
      if (singleState) {
        states = transformMap(get_store_value(repo.cellData), () => singleState);
      } else {
        states = request.body;
      }
      repo.cellState.setStates(states);
      reply.send(Object.keys(request.body));
    }
  });
}
var init_state2 = __esm({
  "src/routes/api/device/state/index.ts"() {
    init_store();
    init_transform();
    init_repository2();
    init_body2();
  }
});

// src/routes/api/device/preset.ts
var preset_exports = {};
__export(preset_exports, {
  default: () => preset_default
});
import fetch2 from "node-fetch";
async function preset_default(fastify) {
  fastify.route({
    method: "POST",
    url: "/api/device/preset",
    async handler(request, reply) {
      const preset = request.body instanceof URLSearchParams ? request.body.get("preset") : request.body.preset;
      const presetResponse = await fetch2(`${request.protocol}://${request.hostname}/preset/${preset}.json`);
      const presetStates = await presetResponse.json();
      repo.cellState.setStates(presetStates);
      reply.send(presetStates);
    }
  });
}
var init_preset = __esm({
  "src/routes/api/device/preset.ts"() {
    init_repository2();
  }
});

// src/routes/api/device/[serial].ts
var serial_exports4 = {};
__export(serial_exports4, {
  default: () => serial_default4
});
import { cellInfoSchema } from "@cell-wall/shared";
function parseAccept(headers) {
  var _a;
  const acceptValues = ((_a = headers["accept"]) == null ? void 0 : _a.split(",")) ?? [];
  return acceptValues.map((value) => {
    const [type, weight] = value.split(";");
    if (weight == null ? void 0 : weight.startsWith("q=")) {
      const q = parseFloat(weight.substring(2));
      return { type, q };
    } else {
      return { type, q: 1 };
    }
  }).sort((a, b) => b.q - a.q);
}
async function serial_default4(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/:serial",
    schema: {
      response: {
        200: __spreadProps(__spreadValues({}, cellInfoSchema), {
          nullable: true
        })
      }
    },
    async handler(request, reply) {
      const { serial } = request.params;
      reply.send(get_store_value(repo.cellData).get(serial) ?? null);
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/:serial",
    async handler(request, reply) {
      const {
        body,
        params: { serial }
      } = request;
      console.log(body);
      await repo.registerCell({
        serial: body.serial || serial,
        server: body.server || `${request.protocol}://${request.hostname}`,
        deviceName: body.deviceName,
        width: body.width,
        height: body.height,
        x: body.x,
        y: body.y
      });
      const accepts = parseAccept(request.headers);
      const acceptsHtml = accepts.find((accept) => accept.type === "text/html");
      if (acceptsHtml) {
        const acceptsJson = accepts.find((accept) => accept.type === "application/json");
        if (!acceptsJson || acceptsJson.q < acceptsHtml.q) {
          reply.redirect(`/cell/frame/blank?id=${serial}`);
        }
      }
      reply.send([serial]);
    }
  });
}
var init_serial4 = __esm({
  "src/routes/api/device/[serial].ts"() {
    init_store();
    init_repository2();
  }
});

// src/routes/api/device/index.ts
var device_exports = {};
__export(device_exports, {
  default: () => device_default
});
async function device_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(get_store_value(repo.cellData)));
    }
  });
}
var init_device = __esm({
  "src/routes/api/device/index.ts"() {
    init_store();
    init_repository2();
  }
});

// src/routes/api/third_party/freebusy.ts
var freebusy_exports = {};
__export(freebusy_exports, {
  default: () => freebusy_default
});
async function freebusy_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/third_party/freebusy",
    async handler(request, reply) {
      const googleClient = await repo.thirdParty.google;
      const requestBody = request.body instanceof URLSearchParams ? Object.fromEntries(request.body) : request.body;
      const res = await googleClient.freebusy({
        requestBody
      });
      if (res.status < 200 || res.status >= 300) {
        reply.status(res.status).send(new Error(`Could not load calendar, ${res.statusText}`));
        return;
      }
      const { errors = [], busy = [] } = Object.values(res.data.calendars)[0];
      if (errors.length > 0) {
        reply.status(500).send(new Error(errors.map((error) => error.reason).join()));
        return;
      }
      reply.status(res.status).header("content-type", "application/json").send(busy);
    }
  });
}
var init_freebusy = __esm({
  "src/routes/api/third_party/freebusy.ts"() {
    init_repository2();
  }
});

// src/routes/api/cellwall-version.ts
var cellwall_version_exports = {};
__export(cellwall_version_exports, {
  default: () => cellwall_version_default
});
async function cellwall_version_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/cellwall-version",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            version: { type: "string" }
          }
        }
      }
    },
    async handler(request, reply) {
      reply.send({ version: VERSION });
    }
  });
}
var init_cellwall_version = __esm({
  "src/routes/api/cellwall-version.ts"() {
    init_env();
  }
});

// src/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
async function routes_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/",
    async handler(request, reply) {
      reply.redirect(301, "/remote/");
    }
  });
}
var init_routes = __esm({
  "src/routes/index.ts"() {
  }
});

// src/routes/oauth2callback.ts
var oauth2callback_exports = {};
__export(oauth2callback_exports, {
  default: () => oauth2callback_default
});
async function oauth2callback_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/oauth2callback",
    schema: {
      querystring: {
        code: { type: "string" }
      }
    },
    async handler(request, reply) {
      const { code } = request.query;
      const googleClient = await repo.thirdParty.google;
      await googleClient.authenticate(code);
      reply.send("Authentication successful! Please return to the console.");
    }
  });
}
var init_oauth2callback = __esm({
  "src/routes/oauth2callback.ts"() {
    init_repository2();
  }
});

// src/index.ts
init_env();
import { handler } from "@cell-wall/client";

// src/server.ts
import Fastify from "fastify";
import middie from "middie";

// src/parser/urlencoded.ts
async function urlEncodedPlugin(fastify) {
  fastify.addContentTypeParser("application/x-www-form-urlencoded", async (_request, payload) => {
    const chunks = [];
    for await (const chunk of payload) {
      chunks.push(chunk);
    }
    const body = new URLSearchParams(chunks.join(""));
    return body;
  });
}

// src/routes.ts
async function routesSubsystem(fastify) {
  await urlEncodedPlugin(fastify);
  await fastify.register(Promise.resolve().then(() => (init_serial(), serial_exports))).register(Promise.resolve().then(() => (init_image3(), image_exports))).register(Promise.resolve().then(() => (init_install(), install_exports))).register(Promise.resolve().then(() => (init_refresh(), refresh_exports))).register(Promise.resolve().then(() => (init_text(), text_exports))).register(Promise.resolve().then(() => (init_serial2(), serial_exports2))).register(Promise.resolve().then(() => (init_power2(), power_exports))).register(Promise.resolve().then(() => (init_serial3(), serial_exports3))).register(Promise.resolve().then(() => (init_state2(), state_exports))).register(Promise.resolve().then(() => (init_preset(), preset_exports))).register(Promise.resolve().then(() => (init_serial4(), serial_exports4))).register(Promise.resolve().then(() => (init_device(), device_exports))).register(Promise.resolve().then(() => (init_freebusy(), freebusy_exports))).register(Promise.resolve().then(() => (init_cellwall_version(), cellwall_version_exports))).register(Promise.resolve().then(() => (init_routes(), routes_exports))).register(Promise.resolve().then(() => (init_oauth2callback(), oauth2callback_exports)));
}

// src/websocket.ts
init_cells();
init_repository2();
import { blankState as blankState4 } from "@cell-wall/shared";
import { WebSocketServer } from "ws";

// src/lib/store/third-party.ts
init_store();

// src/lib/store/promise.ts
init_store();
function resolvedPromiseStore(promise) {
  return readable(void 0, (set) => {
    promise.then(set);
  });
}

// src/lib/store/third-party.ts
function thirdPartySocketStore(repo2) {
  const googleAuthUrl = derived(resolvedPromiseStore(repo2.thirdParty.google), (client, set) => {
    if (client) {
      client.authorizeUrl.subscribe((authorizeUrl) => set({ loading: false, authorizeUrl }));
    } else {
      set({ loading: true });
    }
  }, { loading: true });
  return derived(googleAuthUrl, (googleState) => {
    const socketState = {
      google_loading: googleState.loading,
      google_authorize_url: googleState.authorizeUrl
    };
    return socketState;
  });
}

// src/websocket.ts
var CELL_SERIAL = /^\/cells\/(\w+)\/?$/;
var blankBuffer = new ArrayBuffer(0);
var cellSocketHandler = {
  path: (pathname) => CELL_SERIAL.test(pathname),
  onConnect(ws, request) {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    const [, serial] = pathname.match(CELL_SERIAL);
    repo.webSockets.add(serial, {});
    let lastState = blankState4;
    const unsubscribe = cellStateFor(repo.cellState, serial).subscribe((state) => {
      if (!state)
        return;
      if (state.type === lastState.type) {
        const { payload = blankBuffer } = state;
        ws.send(payload);
      }
      ws.send(JSON.stringify(state));
      ws.send(blankBuffer);
      lastState = state;
    });
    ws.on("message", (data) => {
      const info = JSON.parse(data.toString());
      repo.webSockets.add(serial, info);
    });
    return () => {
      unsubscribe();
      repo.webSockets.delete(serial);
    };
  }
};
var remoteSocketHandler = {
  path: "/remote",
  onConnect(ws) {
    return repo.cellData.subscribe((data) => {
      const dataObject = JSON.stringify(Object.fromEntries(data));
      ws.send(dataObject);
    });
  }
};
var thirdPartySocketHandler = {
  path: "/third_party",
  onConnect(ws) {
    return thirdPartySocketStore(repo).subscribe((socketState) => {
      ws.send(JSON.stringify(socketState));
    });
  }
};
function attachWebsocketHandlers(server, websocketHandlers) {
  const webSocketServers = new WeakMap(websocketHandlers.map((handler2) => {
    const webSocketServer = new WebSocketServer({ noServer: true });
    webSocketServer.on("connection", handler2.onConnect);
    return [handler2, webSocketServer];
  }));
  const pathHandlers = /* @__PURE__ */ new Map();
  const otherHandlers = websocketHandlers.filter((handler2) => {
    if (typeof handler2.path === "string") {
      pathHandlers.set(handler2.path, handler2);
      return false;
    } else {
      return true;
    }
  });
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    let handler2 = pathHandlers.get(pathname);
    if (!handler2) {
      handler2 = otherHandlers.find((handler3) => handler3.path(pathname));
    }
    if (!handler2) {
      socket.destroy();
      return;
    }
    const webSocketServer = webSocketServers.get(handler2);
    webSocketServer.handleUpgrade(request, socket, head, (ws) => {
      webSocketServer.emit("connection", ws, request);
    });
  });
}
async function websocketSubsystem(fastify) {
  attachWebsocketHandlers(fastify.server, [
    cellSocketHandler,
    remoteSocketHandler,
    thirdPartySocketHandler
  ]);
}

// src/server.ts
async function createServer() {
  const fastify = Fastify({
    logger: {
      prettyPrint: true
    },
    trustProxy: true
  });
  await fastify.register(middie);
  await fastify.register(routesSubsystem).register(websocketSubsystem);
  return fastify;
}

// src/index.ts
async function main() {
  const fastify = await createServer();
  fastify.use(handler);
  const address = await fastify.listen(PORT, "0.0.0.0");
  console.log(`Listening on ${address}`);
}
main().catch((err) => {
  console.error("error starting server", err);
  process.exit(1);
});
