import "./cell-state-schema-a24ecc56.js";
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { filterState as f };
