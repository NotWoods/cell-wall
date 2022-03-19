import "./cell-state-schema-de0c81a8.js";
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { filterState as f };
