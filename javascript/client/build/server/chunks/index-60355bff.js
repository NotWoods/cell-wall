import "./cell-state-schema-a24ecc56.js";
const cellStateTypes = /* @__PURE__ */ new Set([
  "BLANK",
  "TEXT",
  "IMAGE",
  "WEB"
]);
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { cellStateTypes as c, filterState as f };
