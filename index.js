// src/server/index.js
import polka from "polka";

// .svelte-kit/node/env.js
var path = process.env["SOCKET_PATH"] || false;
var host = process.env["HOST"] || "0.0.0.0";
var port = process.env["PORT"] || !path && 3e3;

// src/server/index.js
import { assetsMiddleware, kitMiddleware, prerenderedMiddleware } from "./middlewares.js";

// node_modules/.pnpm/svelte@3.43.1/node_modules/svelte/internal/index.mjs
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

// src/server/socket.ts
import WebSocket, { WebSocketServer } from "ws";
function broadcastStoreState(store, options) {
  const wss2 = new WebSocketServer(options);
  function onConnection(ws) {
    console.log("connection");
    ws.send(get_store_value(store));
  }
  wss2.on("connection", onConnection);
  const unsubscribe = store.subscribe((value) => {
    const data = value;
    Array.from(wss2.clients).filter((client) => client.readyState === WebSocket.OPEN).forEach((client) => client.send(data));
    return () => wss2.off("connection", onConnection);
  });
  return {
    wss: wss2,
    unsubscribe
  };
}
function upgradeToWebsocket(match) {
  return (request, socket, head) => {
    const wss2 = match(request);
    if (wss2) {
      wss2.handleUpgrade(request, socket, head, (ws) => wss2.emit("connection", ws, request));
    } else {
      socket.destroy();
    }
  };
}

// src/server/index.js
var repo = globalThis._repo;
var { wss } = broadcastStoreState(repo.cellDataJson, { noServer: true });
var server = polka().use(assetsMiddleware, kitMiddleware, prerenderedMiddleware);
var listenOpts = { path, host, port };
server.listen(listenOpts, () => {
  console.log(`Listening on ${path ? path : host + ":" + port}`);
});
server.server?.on("upgrade", upgradeToWebsocket(() => wss));
export {
  server
};
