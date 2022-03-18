import "./cell-state-schema-b294815b.js";
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { filterState as f };
