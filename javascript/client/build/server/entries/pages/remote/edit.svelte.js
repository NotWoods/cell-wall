import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute, e as escape } from "../../../chunks/index-07af9b00.js";
import { c as connectionToString, D as DeviceOptions, R as ResetSubmit } from "../../../chunks/DeviceOptions-a04f6a77.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-06a204be.js";
import { F as Form } from "../../../chunks/Form-902cd05f.js";
import { g as getRemoteContext, s as storeEntries, a as storeKeys } from "../../../chunks/__layout-6f794c2d.js";
import { P as PowerButtons } from "../../../chunks/_PowerButtons-e7bcebe9.js";
import { p as post } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/Label-f2ecd148.js";
import "../../../chunks/snackbar-host-4e5f0dd7.js";
import "../../../chunks/web-c1f4ba88.js";
import "../../../chunks/TopBar-63a4c84b.js";
const Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let firstDevice;
  let selectedCell;
  let connection;
  let $remoteState, $$unsubscribe_remoteState;
  let $devicesIds, $$unsubscribe_devicesIds;
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  const devices = storeEntries(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  const devicesIds = storeKeys(remoteState);
  $$unsubscribe_devicesIds = subscribe(devicesIds, (value) => $devicesIds = value);
  let selectedDeviceSerial;
  async function submit(formData, action) {
    function getNumber(key) {
      const value = formData.get(key);
      if (typeof value === "string") {
        return Number(value);
      }
      return void 0;
    }
    const data = {
      serial: formData.get("serial"),
      deviceName: formData.get("deviceName"),
      width: getNumber("width"),
      height: getNumber("height"),
      x: getNumber("x"),
      y: getNumber("y"),
      server: formData.get("server")
    };
    await post(action.toString(), data);
  }
  firstDevice = $devicesIds[0];
  selectedCell = $remoteState.get(firstDevice);
  connection = connectionToString(selectedCell == null ? void 0 : selectedCell.connection);
  $$unsubscribe_remoteState();
  $$unsubscribe_devicesIds();
  $$unsubscribe_devices();
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex flex-col gap-y-4",
    action: "/api/device/info/" + selectedDeviceSerial,
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      var _a;
      return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
        default: ({ inputClassName }) => {
          return `<select${add_attribute("class", inputClassName, 0)} name="${"serial"}" id="${"control-serial"}">${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-connection",
        label: "Connection"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-connection"}" name="${"connection"}" type="${"text"}"${add_attribute("value", connection, 0)} readonly class="${escape(inputClassName) + " bg-slate-300"}">`;
        }
      })}

	${((_a = selectedCell == null ? void 0 : selectedCell.connection) == null ? void 0 : _a.includes("android")) ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
        default: () => {
          return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
        }
      })}` : ``}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-deviceName",
        label: "Device Name"
      }, {}, {
        default: ({ inputClassName }) => {
          var _a2;
          return `<input id="${"control-deviceName"}"${add_attribute("class", inputClassName, 0)} name="${"deviceName"}" type="${"text"}"${add_attribute("value", ((_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.deviceName) ?? "", 0)} placeholder="${"Pixel 10"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-width", label: "Width" }, {}, {
        default: ({ inputClassName }) => {
          var _a2;
          return `<input id="${"control-width"}"${add_attribute("class", inputClassName, 0)} name="${"width"}" type="${"number"}"${add_attribute("min", 0, 0)}${add_attribute("value", ((_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.width) ?? "", 0)} placeholder="${"900"}">`;
        }
      })}
	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-height", label: "Height" }, {}, {
        default: ({ inputClassName }) => {
          var _a2;
          return `<input id="${"control-height"}"${add_attribute("class", inputClassName, 0)} name="${"height"}" type="${"number"}"${add_attribute("min", 0, 0)}${add_attribute("value", ((_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.height) ?? "", 0)} placeholder="${"2100"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-x", label: "X Position" }, {}, {
        default: ({ inputClassName }) => {
          var _a2;
          return `<input id="${"control-x"}"${add_attribute("class", inputClassName, 0)} name="${"x"}" type="${"number"}"${add_attribute("value", ((_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.x) ?? "", 0)} placeholder="${"10"}">`;
        }
      })}
	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-y", label: "Y Position" }, {}, {
        default: ({ inputClassName }) => {
          var _a2;
          return `<input id="${"control-y"}"${add_attribute("class", inputClassName, 0)} name="${"y"}" type="${"number"}"${add_attribute("value", ((_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.y) ?? "", 0)} placeholder="${"0"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-server",
        label: "Asset Server"
      }, {}, {
        default: ({ inputClassName }) => {
          var _a2;
          return `<input id="${"control-server"}"${add_attribute("class", inputClassName, 0)} name="${"server"}" type="${"url"}"${add_attribute("value", ((_a2 = selectedCell == null ? void 0 : selectedCell.info) == null ? void 0 : _a2.server) ?? "", 0)} placeholder="${"http://192.168.0.1"}">`;
        }
      })}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Edit as default };
