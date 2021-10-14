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

// src/index.ts
import Fastify from "fastify";

// src/client.ts
import middie from "middie";
import { assetsMiddleware, kitMiddleware, prerenderedMiddleware } from "@cell-wall/client";
var CLIENT_PATHS = ["/remote/*", "/page/*", "/index.html"];
async function clientSubsystem(fastify2) {
  await fastify2.register(middie);
  fastify2.use(assetsMiddleware);
  fastify2.use(CLIENT_PATHS, kitMiddleware);
  fastify2.use(CLIENT_PATHS, prerenderedMiddleware);
}

// ../../node_modules/.pnpm/svelte@3.43.2/node_modules/svelte/internal/index.mjs
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
var tasks = new Set();
var active_docs = new Set();
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
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

// ../../node_modules/.pnpm/svelte@3.43.2/node_modules/svelte/store/index.mjs
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
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

// src/lib/android/device-manager.ts
import { ADB } from "appium-adb";

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

// src/lib/android/adb-action.ts
async function checkIfOn(adb, cmdOutput = void 0) {
  const stdout = cmdOutput || await adb.shell(["dumpsys", "power"]);
  const wakefulness = /mWakefulness=(\w+)/.exec(stdout)?.[1];
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
    args.push("-d", options.dataUri.toString());
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
    throw new Error(`Error attempting to start intent. Original error: ${err}`);
  }
  if (res.toLowerCase().includes("unable to resolve intent")) {
    throw new Error(res);
  }
}

// src/lib/android/device-manager.ts
var DeviceManager = class {
  constructor() {
    this._devices = writable(new Map());
    this.devices.subscribe((map) => {
      this._lastMap = map;
    });
  }
  get devices() {
    return this._devices;
  }
  async refreshDevices() {
    const adbGlobal = await ADB.createADB({
      allowOfflineDevices: false
    });
    const devices = await adbGlobal.getDevicesWithRetry();
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
      await startIntent(adb, options);
      return true;
    });
  }
};

// src/lib/android/github.ts
import { Octokit } from "@octokit/core";
import { createWriteStream, promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { promises as stream } from "stream";

// src/lib/memo.ts
function memo(func) {
  let result;
  return function memoized(...args) {
    if (result === void 0) {
      result = func.apply(this, args);
    }
    return result;
  };
}

// src/lib/android/github.ts
var buildTempDir = memo(() => fs.mkdtemp(join(tmpdir(), "apk-")));
var GithubApi = class {
  constructor(options) {
    this.octokit = new Octokit(options);
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
      await stream.pipeline(res.body, createWriteStream(destPath));
      return destPath;
    } else {
      throw new Error(`Could not find APK attached to release ${release.tag_name}`);
    }
  }
};

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
    await client.cycleWakeUp();
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

// src/lib/cells/manager.ts
var CellManager = class {
  constructor() {
    this._info = writable(new Map());
    this._state = writable(new Map());
  }
  get info() {
    return this._info;
  }
  get state() {
    return this._state;
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
    await db.insertCells(Array.from(get_store_value(this.info).values()));
  }
  register(serial, info) {
    this._info.update((map) => new Map(map).set(serial, info));
  }
  setState(serial, state) {
    this._state.update((map) => new Map(map).set(serial, state));
  }
  setStateMap(states) {
    const entries = typeof states.entries === "function" ? states.entries() : Object.entries(states);
    this._state.update((map) => new Map([...map, ...entries]));
  }
};

// src/lib/cells/schema.ts
function buildCellState(options) {
  const { type, properties = {}, required = [] } = options;
  return {
    type: "object",
    properties: __spreadValues({
      type: {
        type: "string",
        enum: [type]
      }
    }, properties),
    required: ["type", ...required]
  };
}
var cellStateBlankSchema = buildCellState({ type: "BLANK" });
var cellStateWebSchema = buildCellState({
  type: "WEB",
  properties: {
    url: { type: "string", format: "uri" }
  },
  required: ["url"]
});
var cellStateTextSchema = buildCellState({
  type: "TEXT",
  properties: {
    text: { type: "string" },
    backgroundColor: { type: "string" }
  },
  required: ["text"]
});
var cellStateImageSchema = buildCellState({
  type: "IMAGE",
  properties: {
    src: { type: "string", format: "uri" },
    scaleType: {
      type: "string",
      enum: ["FIT_CENTER", "FIT_XY", "CENTER_INSIDE"]
    }
  },
  required: ["src"]
});

// src/lib/cells/state.ts
var CellStateType;
(function(CellStateType2) {
  CellStateType2["BLANK"] = "BLANK";
  CellStateType2["CONFIGURE"] = "CONFIGURE";
  CellStateType2["TEXT"] = "TEXT";
  CellStateType2["IMAGE"] = "IMAGE";
  CellStateType2["BUTTON"] = "BUTTON";
  CellStateType2["WEB"] = "WEB";
})(CellStateType || (CellStateType = {}));
function blankState() {
  return { type: CellStateType.BLANK };
}
function toUri(state, base) {
  const _a = state, { type } = _a, props = __objRest(_a, ["type"]);
  switch (type.toUpperCase()) {
    case CellStateType.WEB: {
      const web = props;
      return new URL(web.url, base);
    }
    case CellStateType.IMAGE: {
      const imgProps = props;
      imgProps.src = new URL(imgProps.src, base).toString();
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

// src/lib/env.ts
import { config } from "dotenv";
config();
var VERSION = "4.0.0";
var SERVER_ADDRESS = process.env["SERVER_ADDRESS"];
var PACKAGE_NAME = "com.tigeroakes.cellwall.client";
var GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
var GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"];
var GITHUB_TOKEN = process.env["GITHUB_TOKEN"];
var DATABASE_FILENAME = process.env["DATABASE_FILENAME"];

// src/lib/google.ts
import { google } from "googleapis";
function initializeGoogle(credentials, googleClientId, googleClientServer) {
  const client = new google.auth.OAuth2(googleClientId, googleClientServer, "https://cellwall.tigeroakes.com/oauth2callback");
  if (credentials) {
    console.log("Loading Google authentication from storage");
    client.setCredentials(credentials);
    return { client };
  }
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"]
  });
  return { client, authorizeUrl };
}
async function authenticateGoogle(client, code) {
  const res = await client.getToken(code);
  client.setCredentials(res.tokens);
  return res.tokens;
}

// src/lib/image/split.ts
import Jimp2 from "jimp";

// src/lib/cells/canvas.ts
var AXIS_TO_POS = new Map().set("width", "x").set("height", "y");
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

// src/lib/image/manipulate.ts
import Jimp from "jimp";
var ALIGN_QUERY = {
  left: Jimp.HORIZONTAL_ALIGN_LEFT,
  right: Jimp.HORIZONTAL_ALIGN_RIGHT,
  center: Jimp.HORIZONTAL_ALIGN_CENTER,
  top: Jimp.VERTICAL_ALIGN_TOP,
  bottom: Jimp.VERTICAL_ALIGN_BOTTOM,
  middle: Jimp.VERTICAL_ALIGN_MIDDLE
};
var RESIZE = new Set([
  Jimp.RESIZE_NEAREST_NEIGHBOR,
  Jimp.RESIZE_BILINEAR,
  Jimp.RESIZE_BICUBIC,
  Jimp.RESIZE_HERMITE,
  Jimp.RESIZE_BEZIER
]);
function has(set, item) {
  return set.has(item);
}
function parseResizeOptions(query = {}) {
  const horizontalFlag = ALIGN_QUERY[query.horizontalAlign] || 0;
  const verticalFlag = ALIGN_QUERY[query.verticalAlign] || 0;
  const resize2 = has(RESIZE, query.resize) ? query.resize : void 0;
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

// src/lib/image/split.ts
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

// src/lib/image/cache.ts
var SplitImageCache = class {
  constructor() {
    this.cache = new Map();
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

// src/lib/map/get.ts
function asArray(items) {
  return Array.isArray(items) ? items : [items];
}
function getAll(map, keys) {
  const result = new Map();
  for (const key of keys) {
    const value = map.get(key);
    if (value !== void 0) {
      result.set(key, value);
    }
  }
  return result;
}

// src/lib/map/subscribe.ts
function subscribeToMapStore(store, subscription) {
  let oldMap;
  return store.subscribe((newMap) => {
    subscription(newMap, oldMap);
    oldMap = newMap;
  });
}

// src/lib/repository/database.ts
import { JSONFile, Memory, Low } from "lowdb";
async function database(filename) {
  const adapter = filename ? new JSONFile(filename) : new Memory();
  const db = new Low(adapter);
  await db.read();
  function initData() {
    return db.data ||= { cells: {} };
  }
  return {
    async getGoogleCredentials() {
      return db.data?.googleCredentials;
    },
    async setGoogleCredentials(credentials) {
      initData().googleCredentials = credentials;
      await db.write();
    },
    async getCell(name) {
      return db.data?.cells?.[name];
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

// src/lib/repository/known.ts
var knownDevices = [
  {
    model: "A0001",
    manufacturer: "OnePlus_One",
    deviceName: "OnePlus One",
    width: 470,
    height: 835
  },
  {
    model: "Amazon_OtterX",
    manufacturer: "Amazon",
    deviceName: "Amazon Kindle",
    width: 1024,
    height: 552
  },
  {
    model: "Moto_G XT1034",
    manufacturer: "Motorola",
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
function computeInfo(serial, model, manufacturer) {
  const known = knownDevices.find((device) => device.model === model && device.manufacturer === manufacturer);
  const autoDeviceName = model.startsWith(manufacturer) ? model : `${manufacturer} ${model}`;
  if (known) {
    return {
      serial,
      deviceName: known.deviceName || autoDeviceName,
      width: known.width,
      height: known.height
    };
  } else {
    return {
      serial,
      deviceName: autoDeviceName
    };
  }
}

// src/lib/repository/repository.ts
function sendIntentOnStateChange(cellManager, deviceManager) {
  subscribeToMapStore(cellManager.state, (newStates, oldStates) => {
    const changes = new Map(newStates);
    if (oldStates) {
      for (const [serial, state] of oldStates) {
        if (changes.get(serial) === state) {
          changes.delete(serial);
        }
      }
    }
    const info = get_store_value(cellManager.info);
    Promise.all(Array.from(changes).map(([serial, state]) => {
      console.log(serial, state);
      const base = info.get(serial)?.server || SERVER_ADDRESS;
      return deviceManager.startIntent(serial, {
        action: `${PACKAGE_NAME}.DISPLAY`,
        dataUri: toUri(state, base),
        waitForLaunch: true
      });
    }));
  });
}
function deriveCellInfo(cellManager, deviceManager) {
  return derived([cellManager.info, cellManager.state, deviceManager.devices], ([infoMap, states, devices]) => {
    const cellInfoMap = new Map();
    for (const [serial, info] of infoMap) {
      cellInfoMap.set(serial, { serial, info, connected: false });
    }
    for (const [serial, state] of states) {
      const existing = cellInfoMap.get(serial);
      if (existing) {
        existing.state = state;
      } else {
        cellInfoMap.set(serial, { serial, state, connected: false });
      }
    }
    for (const [serial, { model, manufacturer }] of devices) {
      const existing = cellInfoMap.get(serial);
      if (existing) {
        existing.connected = true;
        existing.info = __spreadValues(__spreadValues({}, computeInfo(serial, model, manufacturer)), existing.info);
      } else {
        cellInfoMap.set(serial, {
          serial,
          connected: true,
          info: computeInfo(serial, model, manufacturer)
        });
      }
    }
    return cellInfoMap;
  }, new Map());
}
function repository() {
  const dbPromise = database(DATABASE_FILENAME);
  const deviceManager = new DeviceManager();
  let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
  const cellManager = new CellManager();
  const cellManagerPromise = dbPromise.then((db) => cellManager.loadInfo(db));
  sendIntentOnStateChange(cellManager, deviceManager);
  const cellData = deriveCellInfo(cellManager, deviceManager);
  const googleApi = memo(async function googleApi2() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error(`Missing Google API keys`);
    }
    const db = await dbPromise;
    const credentials = await db.getGoogleCredentials();
    const googleClient = initializeGoogle(credentials, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    if (googleClient.authorizeUrl) {
      console.log(`
---
Authenticate with Google:
${googleClient.authorizeUrl}
---
`);
    }
    return googleClient;
  });
  const github = memo(() => {
    if (!GITHUB_TOKEN) {
      throw new Error(`Missing GitHub API keys`);
    }
    return new GithubApi({ auth: GITHUB_TOKEN });
  });
  return {
    cellData,
    cellDataJson: derived(cellData, (map) => JSON.stringify(Object.fromEntries(map))),
    images: new SplitImageCache(),
    refreshDevices() {
      const refreshPromise = deviceManager.refreshDevices();
      deviceManagerPromise = refreshPromise.then(() => deviceManager);
      return refreshPromise;
    },
    async installApk(tag) {
      const apkPath = await github().downloadApk(tag);
      if (apkPath) {
        return await deviceManager.installApkToAll(apkPath, PACKAGE_NAME);
      } else {
        return new Map();
      }
    },
    googleApi,
    async authenticateGoogleApi(code) {
      const db = await dbPromise;
      const googleClient = await googleApi();
      const credentials = await authenticateGoogle(googleClient.client, code);
      await db.setGoogleCredentials(credentials);
    },
    async getPower(serial) {
      const deviceManager2 = await deviceManagerPromise;
      return deviceManager2.checkIfOn(serial);
    },
    async setPower(serial, on) {
      const deviceManager2 = await deviceManagerPromise;
      const devices = get_store_value(deviceManager2.devices);
      const serialList = asArray(serial);
      return setPower(getAll(devices, serialList), on);
    },
    async setState(serial, state) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.setState(serial, state);
    },
    async setStates(states) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.setStateMap(states);
    },
    async registerCell(info) {
      const cellManager2 = await cellManagerPromise;
      cellManager2.register(info.serial, info);
      const db = await dbPromise;
      await cellManager2.writeInfo(db);
    }
  };
}

// src/lib/repository/index.ts
var repo = repository();

// src/routes/api/action/image/[serial].ts
function serial_default(fastify2) {
  fastify2.route({
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

// src/lib/image/rect.ts
function isNumber(number) {
  return typeof number === "number" && !Number.isNaN(number);
}
function validRect(rect = {}) {
  return isNumber(rect.x) && isNumber(rect.y) && isNumber(rect.width) && isNumber(rect.height);
}

// src/parser/image.ts
var MB = 1048576;
async function imagePlugin(fastify2, options) {
  const jimp = await (options.jimp ?? import("jimp"));
  async function contentParser(_request, body) {
    return await jimp.create(body);
  }
  for (const mimeType of Object.keys(jimp.decoders)) {
    fastify2.addContentTypeParser(mimeType, { parseAs: "buffer", bodyLimit: 5 * MB }, contentParser);
  }
}

// src/routes/api/action/image/index.ts
async function updateRemainingCells(remaining, behaviour) {
  switch (behaviour) {
    case "blank":
      await repo.setStates(new Map(remaining.map((serial) => [serial, { type: CellStateType.BLANK }])));
      break;
    case "off":
      await repo.setPower(remaining, false);
      break;
    case "ignore":
      break;
  }
}
function image_default(fastify2) {
  fastify2.register(imagePlugin);
  fastify2.route({
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
      const rects = transformMap(cells, (cell) => cell.info);
      const options = {
        horizontalAlign: request.query.horizontalAlign,
        verticalAlign: request.query.verticalAlign,
        resize: request.query.resize
      };
      repo.images.clear();
      await repo.images.insert(image, rects, options);
      repo.setStates(transformMap(rects, (_, serial) => ({
        type: CellStateType.IMAGE,
        src: `/api/action/image/${serial}`
      })));
      if (request.query.rest) {
        const remaining = Array.from(cellData.keys()).filter((serial) => !rects.has(serial));
        const rest = request.query.rest;
        await updateRemainingCells(remaining, rest ?? "ignore");
      }
      reply.send(Array.from(rects.keys()));
    }
  });
  fastify2.route({
    method: "DELETE",
    url: "/api/action/image/",
    async handler(_request, reply) {
      repo.images.clear();
      reply.status(201).send();
    }
  });
}

// src/routes/api/action/install.ts
function install_default(fastify2) {
  fastify2.route({
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

// src/routes/api/action/refresh.ts
function refresh_default(fastify2) {
  fastify2.route({
    method: ["GET", "POST"],
    url: "/api/action/refresh",
    schema: {
      response: {
        200: {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    async handler(request, reply) {
      const devices = await repo.refreshDevices();
      reply.send(Array.from(devices.keys()));
    }
  });
}

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

// src/routes/api/device/power/[serial].ts
function serial_default2(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/device/power/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      reply.send({
        [serial]: await repo.getPower(serial)
      });
    }
  });
  fastify2.route({
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

// src/routes/api/device/power/index.ts
function power_default(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/device/power/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(await transformMapAsync(get_store_value(repo.cellData), (_data, serial) => repo.getPower(serial))));
    }
  });
  fastify2.route({
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

// src/routes/api/device/state/_body.ts
function isObject(maybe) {
  return typeof maybe === "object" && maybe !== null;
}
function asCellState(maybeState) {
  if (isObject(maybeState)) {
    const state = maybeState;
    if (state.type in CellStateType) {
      return state;
    }
  }
  return void 0;
}

// src/routes/api/device/state/[serial].ts
function serial_default3(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/device/state/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      reply.send({
        [serial]: get_store_value(repo.cellData).get(serial)?.state ?? blankState()
      });
    }
  });
  fastify2.route({
    method: "POST",
    url: "/api/device/state/:serial",
    async handler(request, reply) {
      const { serial } = request.params;
      const state = asCellState(request.body instanceof URLSearchParams ? Object.fromEntries(request.body) : request.body);
      if (!state) {
        reply.status(400).send(new Error(`Invalid body ${request.body}`));
        return;
      }
      await repo.setState(serial, state);
      reply.send([serial]);
    }
  });
}

// src/routes/api/device/state/index.ts
function state_default(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/device/state/",
    async handler(request, reply) {
      reply.send(Object.fromEntries(transformMap(get_store_value(repo.cellData), (data) => data.state ?? blankState())));
    }
  });
  fastify2.route({
    method: "POST",
    url: "/api/device/state/:serial",
    async handler(request, reply) {
      await repo.setStates(request.body);
      reply.send(Object.keys(request.body));
    }
  });
}

// src/routes/api/device/state/preset.ts
import fetch2 from "node-fetch";
function preset_default(fastify2) {
  fastify2.route({
    method: "POST",
    url: "/api/device/preset",
    async handler(request, reply) {
      const preset = request.body instanceof URLSearchParams ? request.body.get("preset") : request.body.preset;
      const presetResponse = await fetch2(`${request.protocol}://${request.hostname}/preset/${preset}.json`);
      const presetStates = await presetResponse.json();
      await repo.setStates(presetStates);
      reply.send(presetStates);
    }
  });
}

// src/routes/api/device/[serial].ts
function serial_default4(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/device/:serial",
    schema: {
      response: {
        200: {
          type: "object",
          nullable: true,
          properties: {
            deviceName: { type: "string" },
            width: { type: "number" },
            height: { type: "number" },
            server: { type: "string" }
          }
        }
      }
    },
    async handler(request, reply) {
      const { serial } = request.params;
      reply.send(get_store_value(repo.cellData).get(serial) ?? null);
    }
  });
  fastify2.route({
    method: "POST",
    url: "/api/device/:serial",
    schema: {
      response: {
        200: {
          type: "object",
          nullable: true,
          properties: {
            deviceName: { type: "string" },
            width: { type: "number" },
            height: { type: "number" },
            server: { type: "string" }
          }
        }
      }
    },
    async handler(request, reply) {
      const { serial } = request.params;
      const info = request.body;
      info.serial = serial;
      info.server ||= `${request.protocol}://${request.hostname}`;
      await repo.registerCell(info);
      reply.send([serial]);
    }
  });
}

// src/routes/api/device/index.ts
function device_default(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/device/",
    schema: {
      response: {
        200: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              deviceName: { type: "string" },
              width: { type: "number" },
              height: { type: "number" },
              server: { type: "string" }
            }
          }
        }
      }
    },
    async handler(request, reply) {
      reply.send(Object.fromEntries(get_store_value(repo.cellData)));
    }
  });
}

// src/routes/api/third_party/freebusy.ts
import { google as google2 } from "googleapis";
function freebusy_default(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/api/third_party/freebusy",
    async handler(request, reply) {
      const { client } = await repo.googleApi();
      const requestBody = request.body instanceof URLSearchParams ? Object.fromEntries(request.body) : request.body;
      const api = google2.calendar({ version: "v3", auth: client });
      const res = await api.freebusy.query({
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

// src/routes/api/cellwall-version.ts
function cellwall_version_default(fastify2) {
  fastify2.route({
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

// src/routes/oauth2callback.ts
function oauth2callback_default(fastify2) {
  fastify2.route({
    method: "GET",
    url: "/oauth2callback",
    schema: {
      querystring: {
        code: { type: "string" }
      }
    },
    async handler(request, reply) {
      const { code } = request.query;
      await repo.authenticateGoogleApi(code);
      reply.send("Authentication successful! Please return to the console.");
    }
  });
}

// src/routes.ts
async function routesSubsystem(fastify2) {
  fastify2.register(serial_default).register(image_default).register(install_default).register(refresh_default).register(serial_default2).register(power_default).register(serial_default3).register(state_default).register(preset_default).register(serial_default4).register(device_default).register(freebusy_default).register(cellwall_version_default).register(oauth2callback_default);
}

// src/websocket.ts
import websocket from "fastify-websocket";
async function websocketSubsystem(fastify2, options) {
  const { store } = options;
  await fastify2.register(websocket, {
    errorHandler(error, connection) {
      console.error("websocket error:", error);
      connection.destroy(error);
    }
  });
  fastify2.get("/", { websocket: true }, ({ socket }) => {
    console.log("connection");
    const unsubscribe = store.subscribe((value) => socket.send(value));
    socket.on("close", unsubscribe);
  });
}

// src/index.ts
var fastify = Fastify({
  logger: true
});
fastify.register(routesSubsystem).register(clientSubsystem).register(websocketSubsystem);
fastify.listen(3e3).then((address) => console.log(`Listening on ${address}`)).catch((err) => {
  console.error("error starting server", err);
  process.exit(1);
});
