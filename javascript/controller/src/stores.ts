import { readable } from 'svelte/store';

export const hash = readable(window.location.hash, function start(set) {
  function onChange() {
    set(window.location.hash);
  }

  window.addEventListener('hashchange', onChange);

  return function stop() {
    window.removeEventListener('hashchange', onChange);
  };
});
