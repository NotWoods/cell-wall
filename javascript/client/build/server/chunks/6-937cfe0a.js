import { r as redirect } from './index-9b9a1ed0.js';

const load = async () => {
  throw redirect(301, "/remote");
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-78d83dce.js')).default;
const universal_id = "src/routes/+page.ts";
const imports = ["_app/immutable/nodes/6.84bb408b.js","_app/immutable/chunks/index.5e2a9a64.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/index.64515c27.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=6-937cfe0a.js.map
