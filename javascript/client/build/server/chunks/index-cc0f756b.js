import "./web-9961d8d9.js";
const types = ["BLANK", "TEXT", "IMAGE", "WEB", "CLOCK"];
const cellStateTypes = new Set(types);
function filterState(type, state) {
  if (state.type === type) {
    return state;
  } else {
    return void 0;
  }
}
export { cellStateTypes as c, filterState as f };
