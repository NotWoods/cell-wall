import { d as derived } from "./web-9fac8a47.js";
function filterState(type, state) {
  return derived(state, ($state, set) => {
    if ($state.type === type) {
      set($state);
    }
  });
}
export { filterState as f };
