import { c as create_ssr_component, v as validate_component, b as add_attribute, p as each } from "../../../chunks/index-50854321.js";
import { c as createLoadWithDevices, H as HorizontalField, D as DeviceOption } from "../../../chunks/_DeviceOption-8c4da22d.js";
import { F as Form } from "../../../chunks/SubmitButton-185fe575.js";
import { P as PowerButtons } from "../../../chunks/_PowerButtons-34decfe4.js";
import { f as formDataAsSearchParams } from "../../../chunks/_form-52443b97.js";
import { R as ResetSubmit } from "../../../chunks/_ResetSubmit-902f2b92.js";
import "../../../chunks/snackbar-host-0b24a4c8.js";
import "../../../chunks/index-06c8ab10.js";
const load = createLoadWithDevices();
const Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedCell;
  let { devices } = $$props;
  let selectedDeviceSerial = devices[0]?.serial;
  async function submit(formData, action) {
    const res = await fetch(action.toString(), {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formDataAsSearchParams(formData)
    });
    console.log(await res.json());
  }
  if ($$props.devices === void 0 && $$bindings.devices && devices !== void 0)
    $$bindings.devices(devices);
  selectedCell = devices.find((cell) => cell.serial === selectedDeviceSerial);
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex flex-col gap-y-4",
    action: "/api/device/" + selectedDeviceSerial,
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
        default: ({ inputClassName }) => {
          return `<select${add_attribute("class", inputClassName, 0)} name="${"serial"}" id="${"control-serial"}">${each(devices, (device) => {
            return `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`;
          })}</select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-connected",
        label: "Connected"
      }, {}, {
        default: () => {
          return `<input type="${"checkbox"}" id="${"control-connected"}" name="${"connected"}" disabled ${selectedCell?.connected ?? false ? "checked" : ""}>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
        default: () => {
          return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
        }
      })}

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
export { Edit as default, load };
