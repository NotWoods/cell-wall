const load = async ({ url }) => {
  return {
    id: url.searchParams.get("id") || "",
    autoJoin: url.searchParams.has("autojoin")
  };
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-da532dfc.js')).default;
const universal_id = "src/routes/cell/+page.ts";
const imports = ["_app/immutable/nodes/7.3d1243c1.js","_app/immutable/chunks/scheduler.fd4d87b3.js","_app/immutable/chunks/index.64515c27.js","_app/immutable/chunks/state-socket.b0f23eaa.js","_app/immutable/chunks/singletons.b467ccca.js","_app/immutable/chunks/index.5159c792.js","_app/immutable/chunks/web.85761f5a.js"];
const stylesheets = ["_app/immutable/assets/7.36b2907f.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=7-bfc30dc6.js.map
