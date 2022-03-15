import "./schema-7c735d14.js";
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { filterState as f };
