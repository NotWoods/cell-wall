import { d as derived } from './index2-505c6d08.js';

function filterState(type, state) {
  return derived(state, ($state, set) => {
    if ($state.type === type) {
      set($state);
    }
  });
}

export { filterState as f };
//# sourceMappingURL=filter-state-e2092dbc.js.map
