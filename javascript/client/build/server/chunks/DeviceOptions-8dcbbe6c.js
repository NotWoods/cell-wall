import { c as create_ssr_component, b as add_attribute, e as escape, p as each, v as validate_component } from "./index-4d214b4e.js";
function connectionToString(connection) {
  if (connection && connection.length > 0) {
    return connection.join(", ");
  } else {
    return "disconnected";
  }
}
const DeviceOption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let connection;
  let { serial } = $$props;
  let { device } = $$props;
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  if ($$props.device === void 0 && $$bindings.device && device !== void 0)
    $$bindings.device(device);
  connection = connectionToString(device.connection);
  return `<option${add_attribute("value", serial, 0)}>${escape(device.info?.deviceName || serial)} (${escape(connection)})
</option>`;
});
const DeviceOptions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { devices } = $$props;
  if ($$props.devices === void 0 && $$bindings.devices && devices !== void 0)
    $$bindings.devices(devices);
  return `${each(devices, ([serial, device]) => {
    return `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { serial, device }, {}, {})}`;
  })}`;
});
export { DeviceOptions as D, connectionToString as c };
