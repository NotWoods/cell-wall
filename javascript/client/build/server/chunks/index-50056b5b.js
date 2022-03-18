import "./cell-state-schema-bc84e86f.js";
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { filterState as f };
