import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute, p as each } from "../../../chunks/index-4d214b4e.js";
import { R as ResetSubmit } from "../../../chunks/ResetSubmit-52d5609f.js";
import { D as DeviceOption } from "../../../chunks/DeviceOption-5e834f75.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-12292c4d.js";
import { F as Form } from "../../../chunks/SubmitButton-d1b813d7.js";
import { a as getRemoteContext, s as storeValues } from "../../../chunks/__layout-ecb13b1e.js";
import { P as PowerButtons } from "../../../chunks/_PowerButtons-d6c57135.js";
import { p as post } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/LoadingSpinner-97b51d95.js";
import "../../../chunks/snackbar-host-d0a4350f.js";
import "../../../chunks/cell-state-schema-bc84e86f.js";
import "../../../chunks/TopBar-fb618005.js";
const Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let firstDevice;
  let selectedCell;
  let $remoteState, $$unsubscribe_remoteState;
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  const devices = storeValues(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
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
  firstDevice = $devices[0]?.serial;
  selectedCell = $remoteState.get(firstDevice);
  $$unsubscribe_remoteState();
  $$unsubscribe_devices();
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex flex-col gap-y-4",
    action: "/api/device/" + selectedDeviceSerial,
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
        default: ({ inputClassName }) => {
          return `<select${add_attribute("class", inputClassName, 0)} name="${"serial"}" id="${"control-serial"}">${each($devices, (device) => {
            return `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`;
          })}</select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-connection",
        label: "Connection"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<select name="${"connection"}" id="${"control-connection"}"${add_attribute("value", selectedCell?.connection ?? "none", 0)} disabled${add_attribute("class", inputClassName, 0)}><option value="${"none"}"></option><option value="${"web"}">Web</option><option value="${"android"}">Android</option></select>`;
        }
      })}

	${selectedCell?.connection === "android" ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
        default: () => {
          return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
        }
      })}` : ``}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-deviceName",
        label: "Device Name"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-deviceName"}"${add_attribute("class", inputClassName, 0)} name="${"deviceName"}" type="${"text"}"${add_attribute("value", selectedCell?.info?.deviceName ?? "", 0)} placeholder="${"Pixel 10"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-width", label: "Width" }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-width"}"${add_attribute("class", inputClassName, 0)} name="${"width"}" type="${"number"}"${add_attribute("min", 0, 0)}${add_attribute("value", selectedCell?.info?.width ?? "", 0)} placeholder="${"900"}">`;
        }
      })}
	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-height", label: "Height" }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-height"}"${add_attribute("class", inputClassName, 0)} name="${"height"}" type="${"number"}"${add_attribute("min", 0, 0)}${add_attribute("value", selectedCell?.info?.height ?? "", 0)} placeholder="${"2100"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-x", label: "X Position" }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-x"}"${add_attribute("class", inputClassName, 0)} name="${"x"}" type="${"number"}"${add_attribute("value", selectedCell?.info?.x ?? "", 0)} placeholder="${"10"}">`;
        }
      })}
	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-y", label: "Y Position" }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-y"}"${add_attribute("class", inputClassName, 0)} name="${"y"}" type="${"number"}"${add_attribute("value", selectedCell?.info?.y ?? "", 0)} placeholder="${"0"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-server",
        label: "Asset Server"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<input id="${"control-server"}"${add_attribute("class", inputClassName, 0)} name="${"server"}" type="${"url"}"${add_attribute("value", selectedCell?.info?.server ?? "", 0)} placeholder="${"http://192.168.0.1"}">`;
        }
      })}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Edit as default };
