import { e as error } from './index-9b9a1ed0.js';

const load = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    throw error(400, "Missing ID");
  }
  return {
    serial: id
  };
};

var _layout_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-bd8a7ccf.js')).default;
const universal_id = "src/routes/cell/frame/+layout.ts";
const imports = ["_app/immutable/nodes/3.7592caef.js","_app/immutable/chunks/index.5e2a9a64.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/chunks/_layout.2ffef5ca.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/index.64515c27.js","_app/immutable/chunks/state-socket.b0f23eaa.js","_app/immutable/chunks/singletons.b467ccca.js","_app/immutable/chunks/index.5159c792.js","_app/immutable/chunks/web.85761f5a.js","_app/immutable/chunks/index.fe5f1800.js","_app/immutable/chunks/random.3e8d6194.js"];
const stylesheets = ["_app/immutable/assets/_layout.2ff2ade9.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=3-e2c206d8.js.map
