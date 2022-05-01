import { c as create_ssr_component, v as validate_component, b as add_attribute, e as escape, f as each } from "./index-0b76d127.js";
import { B as Button, S as SubmitButton } from "./Form-8ab490a9.js";
const ResetSubmit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { loading } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  return `<div class="${"mt-6 ml-auto"}">${validate_component(Button, "Button").$$render($$result, { type: "reset" }, {}, {
    default: () => {
      return `Reset`;
    }
  })}
	${validate_component(SubmitButton, "SubmitButton").$$render($$result, { loading }, {}, {})}</div>`;
});
function connectionToString(connection) {
  if (connection && connection.length > 0) {
    return connection.join(", ");
  } else {
    return "disconnected";
  }
}
const DeviceOption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let connection;
  let { serial } = $$props;
  let { device } = $$props;
  if ($$props.serial === void 0 && $$bindings.serial && serial !== void 0)
    $$bindings.serial(serial);
  if ($$props.device === void 0 && $$bindings.device && device !== void 0)
    $$bindings.device(device);
  connection = connectionToString(device.connection);
  return `<option${add_attribute("value", serial, 0)}>${escape(((_a = device.info) == null ? void 0 : _a.deviceName) || serial)} (${escape(connection)})
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
export { DeviceOptions as D, ResetSubmit as R, connectionToString as c };
