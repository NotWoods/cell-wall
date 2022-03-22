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
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/env.ts
import { env, VERSION } from "@cell-wall/shared/src/env";
import { config } from "dotenv";
import { networkInterfaces } from "os";
import { resolve } from "path";
function lookupLocalIp() {
  var _a, _b;
  const interfaces = networkInterfaces();
  const results = /* @__PURE__ */ new Map();
  for (const [name, networks = []] of Object.entries(interfaces)) {
    networks.filter((network) => network.family === "IPv4" && !network.internal).forEach((network) => {
      const resultArray = results.get(name) || [];
      resultArray.push(network.address);
      results.set(name, resultArray);
    });
  }
  const [firstResult] = results.values();
  return ((_a = results.get("eth0")) == null ? void 0 : _a[0]) ?? ((_b = results.get("wlan0")) == null ? void 0 : _b[0]) ?? (firstResult == null ? void 0 : firstResult[0]);
}
var SERVER_ADDRESS, PORT, PACKAGE_NAME, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_TOKEN, DATABASE_FILENAME;
var init_env = __esm({
  "src/lib/env.ts"() {
    config({ path: resolve(process.cwd(), "../../../.env") });
    ({
      SERVER_ADDRESS,
      PORT,
      PACKAGE_NAME,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GITHUB_TOKEN,
      DATABASE_FILENAME
    } = env(process.env, lookupLocalIp()));
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
async function allSettledMap(map, transform) {
  const newValues = await Promise.allSettled(Array.from(map.entries(), async ([key, value]) => transform(value, key)));
  const result = /* @__PURE__ */ new Map();
  for (const [i, key] of Array.from(map.keys()).entries()) {
    const value = newValues[i];
    result.set(key, value);
  }
  return result;
}
var init_transform = __esm({
  "src/lib/map/transform.ts"() {
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
  return new Promise((resolve2, reject) => image.cover(width, height, alignBits, resizeMode, (err, value) => {
    if (err)
      reject(err);
    else
      resolve2(value);
  }));
}
function crop(image, cell) {
  return new Promise((resolve2, reject) => image.crop(cell.x, cell.y, cell.width, cell.height, (err, value) => {
    if (err)
      reject(err);
    else
      resolve2(value);
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
import { cellCanvas, shiftCell } from "@cell-wall/shared";
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

// src/lib/image/index.ts
var init_image = __esm({
  "src/lib/image/index.ts"() {
    init_cache();
    init_manipulate();
    init_split();
  }
});

// src/lib/android/adb-actions.ts
import { escapeShellArg } from "appium-adb/build/lib/helpers.js";
async function getWakefulness(adb) {
  var _a;
  const stdout = await adb.shell(["dumpsys", "power", "|", "grep", '"mWakefulness="']);
  const wakefulness = (_a = /mWakefulness=(\w+)/.exec(stdout)) == null ? void 0 : _a[1];
  return wakefulness;
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
var init_adb_actions = __esm({
  "src/lib/android/adb-actions.ts"() {
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

// src/lib/android/adb-devices.ts
import { ADB } from "appium-adb";
function noDeviceError(err) {
  return err instanceof Error && err.message.includes("Could not find a connected Android device");
}
function createChildAdb(parent) {
  const adbChild = new ADB();
  adbChild.sdkRoot = parent.sdkRoot;
  adbChild.executable.path = parent.executable.path;
  return adbChild;
}
function adbDevicesStore() {
  const devicesStore = writable(/* @__PURE__ */ new Map());
  const adbGlobalReady = ADB.createADB();
  return {
    subscribe: devicesStore.subscribe,
    async refresh() {
      const adbGlobal = await adbGlobalReady;
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
      const adbDevices = new Map(devices.map((device) => {
        const adbChild = createChildAdb(adbGlobal);
        adbChild.setDevice(device);
        return [device.udid, adbChild];
      }));
      devicesStore.set(adbDevices);
    }
  };
}
var init_adb_devices = __esm({
  "src/lib/android/adb-devices.ts"() {
    init_store();
  }
});

// src/lib/android/android-powered.ts
function androidPowered(devices) {
  async function refreshDevicePowerStates($devices) {
    const powered = /* @__PURE__ */ new Set();
    await Promise.all(Array.from($devices).map(async ([udid, adb]) => {
      const wakefulness = await getWakefulness(adb);
      if (wakefulness === "Awake") {
        powered.add(udid);
      }
    }));
    return powered;
  }
  const poweredOn = writable(/* @__PURE__ */ new Set(), (set) => {
    return devices.subscribe(($devices) => {
      let invalidated = false;
      refreshDevicePowerStates($devices).then((powered) => {
        if (!invalidated) {
          set(powered);
        }
      });
      return () => {
        invalidated = true;
      };
    });
  });
  async function setPowerForDevice(adb, on) {
    if (!adb)
      return;
    const wakefulness = await getWakefulness(adb);
    if (wakefulness === "Awake") {
      if (on) {
        await adb.keyevent(KEYCODE_UNKNOWN);
      } else {
        await adb.keyevent(KEYCODE_POWER);
      }
    } else {
      if (on) {
        await adb.cycleWakeUp();
      } else {
      }
    }
  }
  async function updateStore(updater) {
    const promises = /* @__PURE__ */ new Map();
    poweredOn.update((oldSet) => {
      const newSet = updater(oldSet);
      const $devices = get_store_value(devices);
      const added = Array.from(newSet).filter((udid) => !oldSet.has(udid));
      const removed = Array.from(oldSet).filter((udid) => !newSet.has(udid));
      function updatePower(udid, on) {
        const device = $devices.get(udid);
        if (device) {
          promises.set(udid, setPowerForDevice(device, on));
        }
      }
      added.forEach((udid) => updatePower(udid, true));
      removed.forEach((udid) => updatePower(udid, false));
      return newSet;
    });
    return allSettledMap(promises, (promise) => promise);
  }
  return {
    subscribe: poweredOn.subscribe,
    update: updateStore,
    set(newSet) {
      return updateStore(() => newSet);
    },
    async refresh() {
      poweredOn.set(await refreshDevicePowerStates(get_store_value(devices)));
    }
  };
}
var KEYCODE_UNKNOWN, KEYCODE_POWER;
var init_android_powered = __esm({
  "src/lib/android/android-powered.ts"() {
    init_store();
    init_transform();
    init_adb_actions();
    KEYCODE_UNKNOWN = 0;
    KEYCODE_POWER = 26;
  }
});

// src/lib/android/android-properties.ts
function androidProperties(devices) {
  return derived(devices, ($devices, set) => {
    let invalidated = false;
    transformMapAsync($devices, async (adb) => {
      const [model, manufacturer] = await Promise.all([adb.getModel(), adb.getManufacturer()]);
      const properties = {
        model,
        manufacturer
      };
      return properties;
    }).then((map) => {
      if (!invalidated) {
        set(map);
      }
    });
    return () => {
      invalidated = true;
    };
  }, /* @__PURE__ */ new Map());
}
var init_android_properties = __esm({
  "src/lib/android/android-properties.ts"() {
    init_store();
    init_transform();
  }
});

// src/lib/android/android-device-manager.ts
var AndroidDeviceManager;
var init_android_device_manager = __esm({
  "src/lib/android/android-device-manager.ts"() {
    init_store();
    init_env();
    init_transform();
    init_adb_actions();
    init_adb_devices();
    init_android_powered();
    init_android_properties();
    AndroidDeviceManager = class {
      constructor() {
        this.devices = adbDevicesStore();
        this.properties = androidProperties(this.devices);
        this.powered = androidPowered(this.devices);
      }
      async launchClient(serial, host) {
        const adb = get_store_value(this.devices).get(serial);
        if (!adb)
          return;
        await startIntent(adb, {
          action: `${PACKAGE_NAME}.DISPLAY`,
          dataUri: new URL(`/cell?id=${serial}&autojoin`, host),
          waitForLaunch: true
        });
      }
      async updateClient(apkPath, targetDevices) {
        const $devices = get_store_value(this.devices);
        const devicesToUpdate = targetDevices ? filterMap($devices, (_, serial) => targetDevices.has(serial)) : $devices;
        return transformMapAsync(devicesToUpdate, (adb) => adb.installOrUpgrade(apkPath, PACKAGE_NAME, { enforceCurrentBuild: true }));
      }
      async connectOverUsb(serial, devicePort = PORT) {
        const adb = get_store_value(this.devices).get(serial);
        if (!adb)
          return;
        await adb.reversePort(devicePort, PORT);
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
var init_state = __esm({
  "src/lib/cells/state.ts"() {
    init_store();
  }
});

// src/lib/store/changes.ts
function withLastState(store) {
  let oldState;
  return derived(store, (newState) => {
    const result = [newState, oldState];
    oldState = newState;
    return result;
  });
}
var init_changes = __esm({
  "src/lib/store/changes.ts"() {
    init_store();
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
import { blankState } from "@cell-wall/shared";
function equalConnectionArrays(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  const aSet = new Set(a);
  return b.every((type) => aSet.has(type));
}
function deriveCellInfo(stores) {
  let lastResult = /* @__PURE__ */ new Map();
  return derived([stores.database, stores.androidProperties, stores.webSockets], ([$database, $androidProps, $webSocketInfo]) => {
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
    mergeFrom($webSocketInfo, (socketInfo) => ({
      width: socketInfo.width,
      height: socketInfo.height,
      server: socketInfo.url.origin
    }));
    mergeFrom($androidProps, ({ model, manufacturer }) => computeInfo(model, manufacturer));
    mergeFrom($database, (info) => info);
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
  return derived([stores.androidProperties, stores.webSockets], ([$androidProps, $webSocketInfo]) => {
    const connections = /* @__PURE__ */ new Map();
    for (const id of $webSocketInfo.keys()) {
      connections.set(id, ["web"]);
    }
    for (const serial of $androidProps.keys()) {
      const array = connections.get(serial) ?? [];
      array.push("android");
      connections.set(serial, array);
    }
    return connections;
  });
}
function deriveCellData(stores) {
  const cellInfo = deriveCellInfo(stores);
  const connections = deriveConnection(stores);
  const cellDataMap = derived([stores.state, cellInfo, connections], ([$states, $infos, $connections]) => {
    const keys = /* @__PURE__ */ new Set([...$states.keys(), ...$infos.keys(), ...$connections.keys()]);
    return new Map(Array.from(keys).map((serial) => {
      const newData = {
        info: $infos.get(serial),
        state: $states.get(serial) ?? blankState,
        connection: $connections.get(serial) ?? []
      };
      return [serial, newData];
    }));
  });
  return derived(withLastState(cellDataMap), ([result, lastResult]) => {
    return transformMap(result, (newData, serial) => {
      const oldData = lastResult == null ? void 0 : lastResult.get(serial);
      if (oldData && newData.info === oldData.info && newData.state === oldData.state && equalConnectionArrays(newData.connection, oldData.connection)) {
        return oldData;
      } else {
        return newData;
      }
    });
  });
}
var init_combine_cell = __esm({
  "src/lib/repository/combine-cell.ts"() {
    init_store();
    init_transform();
    init_changes();
    init_known();
  }
});

// src/lib/repository/database.ts
import { JSONFile, Low, Memory } from "lowdb";
function database(filename) {
  const adapter = filename ? new JSONFile(filename) : new Memory();
  const db = new Low(adapter);
  const store = writable({ cells: {} });
  const init = db.read().then(() => {
    db.data ||= { cells: {} };
    store.set(db.data);
  });
  async function update(updater) {
    await init;
    store.update((oldData) => {
      const newData = updater(oldData);
      db.data = newData;
      return newData;
    });
    await db.write();
  }
  return {
    subscribe: store.subscribe,
    update,
    async get() {
      await init;
      return get_store_value(store);
    },
    set(value) {
      return update(() => value);
    }
  };
}
function addCellInfo(serial, newInfo) {
  return (data) => {
    const info = data.cells[serial] ?? { serial };
    return __spreadProps(__spreadValues({}, data), {
      cells: __spreadProps(__spreadValues({}, data.cells), {
        [serial]: __spreadValues(__spreadValues({}, info), newInfo)
      })
    });
  };
}
var init_database = __esm({
  "src/lib/repository/database.ts"() {
    init_store();
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
      static async create(db) {
        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
          throw new Error(`Missing Google API keys`);
        }
        const data = await db.get();
        const credentials = data.googleCredentials;
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
          await this.db.update((data) => __spreadProps(__spreadValues({}, data), {
            googleCredentials: res.tokens
          }));
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
function thirdPartyConnectRepository(db) {
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
        google = GoogleClient.create(db);
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
function androidConnections(data) {
  const connectionInfo = transformMap(data, (cellData) => {
    var _a;
    return {
      server: (_a = cellData.info) == null ? void 0 : _a.server,
      connection: new Set(cellData.connection)
    };
  });
  return filterMap(connectionInfo, ({ connection }) => connection.has("android") && !connection.has("web"));
}
function repository() {
  const db = database(DATABASE_FILENAME);
  const cellState = cellStateStore();
  const webSockets = webSocketStore();
  const deviceManager = new AndroidDeviceManager();
  let deviceManagerPromise = deviceManager.devices.refresh().then(() => deviceManager);
  const cellData = deriveCellData({
    database: derived(db, (data) => new Map(Object.entries(data.cells))),
    state: cellState,
    androidProperties: deviceManager.properties,
    webSockets
  });
  const android = derived(cellData, androidConnections);
  cellData.subscribe((state) => console.info("CellData", state));
  const thirdParty = thirdPartyConnectRepository(db);
  return {
    cellData,
    cellState,
    androidConnections: android,
    powered: deviceManager.powered,
    webSockets,
    thirdParty,
    refreshDevices() {
      const refreshPromise = deviceManager.devices.refresh();
      deviceManagerPromise = refreshPromise.then(() => deviceManager);
      return refreshPromise;
    },
    async installApk(tag) {
      const apkPath = await thirdParty.github.downloadApk(tag);
      if (apkPath) {
        return await deviceManager.updateClient(apkPath);
      } else {
        return /* @__PURE__ */ new Map();
      }
    },
    async connectDevicePort(serial, port) {
      const deviceManager2 = await deviceManagerPromise;
      await deviceManager2.connectOverUsb(serial, port);
      await db.update(addCellInfo(serial, { server: `http://localhost:${port}` }));
    },
    async setPower(serials, on) {
      const deviceManager2 = await deviceManagerPromise;
      return deviceManager2.powered.update((oldSet) => {
        const newSet = new Set(oldSet);
        if (on) {
          serials.forEach((serial) => newSet.add(serial));
        } else {
          serials.forEach((serial) => newSet.delete(serial));
        }
        return newSet;
      });
    },
    async registerCell(info) {
      await db.update(addCellInfo(info.serial, info));
    },
    async openClientOnDevice(serial) {
      var _a;
      const deviceManager2 = await deviceManagerPromise;
      const { server = SERVER_ADDRESS } = ((_a = get_store_value(cellData).get(serial)) == null ? void 0 : _a.info) ?? {};
      await deviceManager2.launchClient(serial, server);
    }
  };
}
var init_repository = __esm({
  "src/lib/repository/repository.ts"() {
    init_store();
    init_android_device_manager();
    init_state();
    init_env();
    init_transform();
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

// src/routes/api/action/_remaining.ts
import { blankState as blankState2 } from "@cell-wall/shared";
async function updateRemainingCells(remaining, behaviour) {
  switch (behaviour) {
    case "blank":
      repo.cellState.setStates(new Map(remaining.map((serial) => [serial, blankState2])));
      break;
    case "off":
      await repo.setPower(remaining, false);
      break;
    case "ignore":
      break;
  }
}
var init_remaining = __esm({
  "src/routes/api/action/_remaining.ts"() {
    init_repository2();
  }
});

// src/routes/api/action/image.ts
var image_exports = {};
__export(image_exports, {
  default: () => image_default
});
import {
  validRectWithPos
} from "@cell-wall/shared";
async function image_default(fastify) {
  await imagePlugin(fastify);
  const images = new SplitImageCache();
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
      const cells = filterMap(cellData, (cell, serial) => validRectWithPos(cell.info) && includes(serial));
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
      images.clear();
      await images.insert(image, rects, options);
      const imageStates = await transformMapAsync(rects, async (_, serial) => {
        const buffer = await images.get(serial).getBufferAsync(image.getMIME());
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        return {
          type: "IMAGE",
          payload: arrayBuffer
        };
      });
      repo.cellState.setStates(imageStates);
      if (request.query.rest) {
        const remaining = Array.from(cellData.keys()).filter((serial) => !rects.has(serial));
        await updateRemainingCells(remaining, request.query.rest || "ignore");
      }
      reply.send(Object.fromEntries(imageStates));
    }
  });
  fastify.route({
    method: "DELETE",
    url: "/api/action/image/",
    async handler(_request, reply) {
      images.clear();
      reply.status(201).send();
    }
  });
  fastify.route({
    method: "GET",
    url: "/api/action/image/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      const cached = images.get(serial);
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
var init_image3 = __esm({
  "src/routes/api/action/image.ts"() {
    init_store();
    init_image();
    init_transform();
    init_repository2();
    init_image2();
    init_remaining();
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

// src/routes/api/action/launch.ts
var launch_exports = {};
__export(launch_exports, {
  default: () => launch_default
});
async function launch_default(fastify) {
  fastify.route({
    method: ["GET", "POST"],
    url: "/api/action/launch",
    async handler(request, reply) {
      const devices = get_store_value(repo.androidConnections);
      const results = await allSettledMap(devices, (_, serial) => repo.openClientOnDevice(serial));
      reply.send(Object.fromEntries(results));
    }
  });
}
var init_launch = __esm({
  "src/routes/api/action/launch.ts"() {
    init_store();
    init_transform();
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
      await repo.refreshDevices();
      reply.send(get_store_value(androidDevices));
    }
  });
}
var androidDevices;
var init_refresh = __esm({
  "src/routes/api/action/refresh.ts"() {
    init_store();
    init_repository2();
    androidDevices = derived(repo.cellData, ($cellData) => Object.fromEntries(Array.from($cellData).filter(([, data]) => data.connection.includes("android")).map(([serial, data]) => [serial, data.info])));
  }
});

// src/routes/api/action/text.ts
var text_exports = {};
__export(text_exports, {
  default: () => text_default
});
import { RandomColor, textState } from "@cell-wall/shared";
function parseLines(body) {
  if (typeof body === "string") {
    return body.split(/\s*\n\s*/g);
  } else if (Array.isArray(body)) {
    return body;
  } else if (Array.isArray(body.lines)) {
    return body.lines;
  } else if (typeof body.text === "string") {
    return parseLines(body.text);
  } else {
    return [];
  }
}
async function text_default(fastify) {
  fastify.route({
    method: "POST",
    url: "/api/action/text",
    async handler(request, reply) {
      const lines = parseLines(request.body);
      const deviceIds = get_store_value(sortedDeviceIds);
      const deviceToText = /* @__PURE__ */ new Map();
      for (const [i, line] of lines.entries()) {
        const index = i % deviceIds.length;
        const deviceId = deviceIds[index];
        const textArray = deviceToText.get(deviceId) ?? [];
        textArray.push(line);
        deviceToText.set(deviceId, textArray);
      }
      const colors = new RandomColor();
      const textStates = transformMap(deviceToText, (lines2) => textState(lines2.join(", "), request.query.backgroundColor ?? colors.next()));
      repo.cellState.setStates(textStates);
      if (request.query.rest) {
        const remaining = Array.from(deviceIds).filter((serial) => !deviceToText.has(serial));
        await updateRemainingCells(remaining, request.query.rest || "ignore");
      }
      reply.send(Object.fromEntries(textStates));
    }
  });
}
var sortedDeviceIds;
var init_text = __esm({
  "src/routes/api/action/text.ts"() {
    init_store();
    init_transform();
    init_repository2();
    init_remaining();
    sortedDeviceIds = derived(repo.cellData, (devices) => {
      return Array.from(devices).sort(([, a], [, b]) => {
        var _a, _b;
        return (((_a = b.info) == null ? void 0 : _a.width) ?? 0) - (((_b = a.info) == null ? void 0 : _b.width) ?? 0);
      }).map(([id]) => id);
    });
  }
});

// src/routes/api/device/info.ts
var info_exports = {};
__export(info_exports, {
  default: () => info_default
});
import { cellInfoSchema } from "@cell-wall/shared";
async function info_default(fastify) {
  const cellInfo = derived(repo.cellData, ($cellData) => transformMap($cellData, (cellInfo2) => cellInfo2.info ?? null));
  fastify.route({
    method: "GET",
    url: "/api/device/info/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(get_store_value(cellInfo)));
    }
  });
  fastify.route({
    method: "GET",
    url: "/api/device/info/:serial",
    schema: {
      response: {
        200: __spreadProps(__spreadValues({}, cellInfoSchema), {
          nullable: true
        })
      }
    },
    async handler(request, reply) {
      const { serial } = request.params;
      reply.send(get_store_value(cellInfo).get(serial) ?? null);
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/info/:serial",
    async handler(request, reply) {
      const {
        body,
        params: { serial }
      } = request;
      await repo.registerCell({
        serial: body.serial || serial,
        server: body.server || `${request.protocol}://${request.hostname}`,
        deviceName: body.deviceName,
        width: body.width,
        height: body.height,
        x: body.x,
        y: body.y
      });
      reply.send([serial]);
    }
  });
}
var init_info = __esm({
  "src/routes/api/device/info.ts"() {
    init_store();
    init_transform();
    init_repository2();
  }
});

// src/routes/api/device/power.ts
var power_exports = {};
__export(power_exports, {
  default: () => power_default
});
function asPower(primitive) {
  switch (primitive) {
    case true:
    case false:
      return primitive;
    case "false":
      return false;
    case 0:
    case 1:
    case "true":
      return Boolean(primitive);
    default:
      return void 0;
  }
}
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
async function power_default(fastify) {
  const serials = derived(repo.cellData, ($cellData) => Array.from($cellData.keys()));
  fastify.route({
    method: "GET",
    url: "/api/device/power/",
    async handler(request, reply) {
      await repo.powered.refresh();
      const powered = get_store_value(repo.powered);
      const $serials = get_store_value(serials);
      reply.send(Object.fromEntries($serials.map((serial) => [serial, powered.has(serial)])));
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
      await repo.powered.refresh();
      const $serials = get_store_value(serials);
      const settled = Array.from((await repo.setPower($serials, power)).values());
      if (settled.every(({ status }) => status === "fulfilled")) {
        reply.status(200).send(power);
      } else {
        const errors = settled.filter((result) => result.status === "rejected").map(({ reason }) => reason);
        console.error(errors);
        reply.status(500).send(new AggregateError(errors));
      }
    }
  });
  fastify.route({
    method: "GET",
    url: "/api/device/power/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      await repo.powered.refresh();
      const powered = get_store_value(repo.powered);
      reply.send({
        [serial]: powered.has(serial)
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
      await repo.powered.refresh();
      const settled = await repo.setPower([serial], power);
      const serialSettled = settled.get(serial);
      switch (serialSettled == null ? void 0 : serialSettled.status) {
        case "fulfilled":
          reply.status(200).send(power);
          break;
        case "rejected":
          reply.status(500).send(serialSettled == null ? void 0 : serialSettled.reason);
          break;
        default:
          reply.status(404).send(new Error(`Device ${serial} not found`));
      }
    }
  });
}
var init_power = __esm({
  "src/routes/api/device/power.ts"() {
    init_store();
    init_repository2();
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

// src/routes/api/device/state.ts
var state_exports = {};
__export(state_exports, {
  default: () => state_default
});
import { blankState as blankState3, cellStateTypes } from "@cell-wall/shared";
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
async function state_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/device/state/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(get_store_value(repo.cellState)));
    }
  });
  fastify.route({
    method: "POST",
    url: "/api/device/state/",
    async handler(request, reply) {
      const singleState = asCellState(request.body);
      let states;
      if (singleState) {
        states = transformMap(get_store_value(repo.cellState), () => singleState);
      } else {
        states = request.body;
      }
      repo.cellState.setStates(states);
      reply.send(Object.fromEntries(get_store_value(repo.cellState)));
    }
  });
  fastify.route({
    method: "GET",
    url: "/api/device/state/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      const state = get_store_value(repo.cellState).get(serial) ?? blankState3;
      reply.send({ [serial]: state });
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
      reply.send({ [serial]: state });
    }
  });
}
var init_state2 = __esm({
  "src/routes/api/device/state.ts"() {
    init_store();
    init_transform();
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

// src/routes/api/third_party/index.ts
var third_party_exports = {};
__export(third_party_exports, {
  default: () => third_party_default
});
async function third_party_default(fastify) {
  fastify.route({
    method: "GET",
    url: "/api/third_party/",
    async handler(request, reply) {
      const googleClient = await repo.thirdParty.google;
      reply.send({ google_authorize_url: get_store_value(googleClient.authorizeUrl) });
    }
  });
}
var init_third_party = __esm({
  "src/routes/api/third_party/index.ts"() {
    init_store();
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
  await fastify.register(Promise.resolve().then(() => (init_image3(), image_exports))).register(Promise.resolve().then(() => (init_install(), install_exports))).register(Promise.resolve().then(() => (init_launch(), launch_exports))).register(Promise.resolve().then(() => (init_refresh(), refresh_exports))).register(Promise.resolve().then(() => (init_text(), text_exports))).register(Promise.resolve().then(() => (init_info(), info_exports))).register(Promise.resolve().then(() => (init_power(), power_exports))).register(Promise.resolve().then(() => (init_preset(), preset_exports))).register(Promise.resolve().then(() => (init_state2(), state_exports))).register(Promise.resolve().then(() => (init_device(), device_exports))).register(Promise.resolve().then(() => (init_freebusy(), freebusy_exports))).register(Promise.resolve().then(() => (init_third_party(), third_party_exports))).register(Promise.resolve().then(() => (init_cellwall_version(), cellwall_version_exports))).register(Promise.resolve().then(() => (init_routes(), routes_exports))).register(Promise.resolve().then(() => (init_oauth2callback(), oauth2callback_exports)));
}

// src/websocket.ts
init_state();
init_repository2();
import { blankState as blankState4 } from "@cell-wall/shared";
import { WebSocketServer } from "ws";
var CELL_SERIAL = /^\/cells\/(\w+)\/?$/;
var blankBuffer = new ArrayBuffer(0);
var cellSocketHandler = {
  path: (pathname) => CELL_SERIAL.test(pathname),
  onConnect(ws, request) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const { pathname } = url;
    const [, serial] = pathname.match(CELL_SERIAL);
    repo.webSockets.add(serial, { url });
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
      const { width, height } = JSON.parse(data.toString());
      repo.webSockets.add(serial, { width, height, url });
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
  attachWebsocketHandlers(fastify.server, [cellSocketHandler, remoteSocketHandler]);
}

// src/server.ts
async function createServer() {
  const fastify = Fastify({
    logger: {
      prettyPrint: {
        translateTime: "yyyy-mm-dd HH:MM:ss.l",
        levelFirst: true,
        ignore: "pid,hostname,reqId,responseTime,req,res",
        messageFormat: "{msg} [id={reqId} {req.method} {req.url}]"
      }
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
  console.log(`IP is ${SERVER_ADDRESS}`);
}
main().catch((err) => {
  console.error("error starting server", err);
  process.exit(1);
});
