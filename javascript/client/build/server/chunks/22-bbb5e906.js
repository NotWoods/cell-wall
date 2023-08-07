import { e as error } from './index-9b9a1ed0.js';

const load = async ({ fetch }) => {
  const response = await fetch("/api/third_party/");
  if (!response.ok) {
    throw error(500, `Could not load, ${response.statusText}`);
  }
  const body = await response.json();
  return {
    googleAuthUrl: body.google_authorize_url
  };
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 22;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-bf3b96e4.js')).default;
const universal_id = "src/routes/remote/third_party/+page.ts";
const imports = ["_app/immutable/nodes/22.54540b67.js","_app/immutable/chunks/index.5e2a9a64.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/index.64515c27.js","_app/immutable/chunks/HorizontalField.160b8ef4.js","_app/immutable/chunks/Label.91c214fa.js","_app/immutable/chunks/spread.8a54911c.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=22-bbb5e906.js.map
