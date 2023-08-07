const load = async ({ url }) => {
  return {
    defaultSerial: url.searchParams.get("id") || ""
  };
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-92224c81.js')).default;
const universal_id = "src/routes/remote/custom/+page.ts";
const imports = ["_app/immutable/nodes/17.f73eafc3.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/index.64515c27.js","_app/immutable/chunks/each.0555d8d8.js","_app/immutable/chunks/DeviceOptions.b118da36.js","_app/immutable/chunks/Form.09dfc92a.js","_app/immutable/chunks/spread.8a54911c.js","_app/immutable/chunks/snackbar-host.8684c3d0.js","_app/immutable/chunks/web.85761f5a.js","_app/immutable/chunks/index.5159c792.js","_app/immutable/chunks/HorizontalField.160b8ef4.js","_app/immutable/chunks/Label.91c214fa.js","_app/immutable/chunks/4.edd4c780.js","_app/immutable/chunks/stores.bc7ffb6f.js","_app/immutable/chunks/singletons.b467ccca.js","_app/immutable/chunks/TopBar.6950972f.js","_app/immutable/chunks/index.fe5f1800.js","_app/immutable/chunks/color.f67fd270.js","_app/immutable/chunks/random.3e8d6194.js","_app/immutable/chunks/index.9144b5bf.js","_app/immutable/chunks/_PowerButtons.e4bf962c.js","_app/immutable/chunks/_form.d55ea23c.js"];
const stylesheets = ["_app/immutable/assets/4.dce25c9c.css","_app/immutable/assets/TopBar.4cc7f15f.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=17-06bfad91.js.map
