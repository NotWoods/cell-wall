import type { CellInfo } from '@cell-wall/cells';
import Controller from './Controller.svelte';

declare global {
  interface Window {
    devices: { serial: string; info: CellInfo }[];
    app: Controller;
  }
}

window.app = new Controller({
  target: document.body,
  props: {
    devices: window.devices,
  },
});
