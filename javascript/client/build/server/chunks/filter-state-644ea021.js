import { d as derived } from "./web-c1f4ba88.js";
function filterState(type, state) {
  return derived(state, ($state, set) => {
    if ($state.type === type) {
      set($state);
    }
  });
}
export { filterState as f };
