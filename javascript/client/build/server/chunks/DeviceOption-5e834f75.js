import { c as create_ssr_component, b as add_attribute, e as escape } from "./index-4d214b4e.js";
const DeviceOption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { device } = $$props;
  if ($$props.device === void 0 && $$bindings.device && device !== void 0)
    $$bindings.device(device);
  return `<option${add_attribute("value", device.serial, 0)}>${escape(device.info?.deviceName || device.serial)} (${escape(device.connection ?? "disconnected")})
</option>`;
});
export { DeviceOption as D };
