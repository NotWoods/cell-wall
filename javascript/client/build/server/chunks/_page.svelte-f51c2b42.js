import { c as create_ssr_component, s as subscribe, v as validate_component, a as add_attribute, e as escape } from './ssr-966736c7.js';
import { c as connectionToString, F as Form, D as DeviceOptions, R as ResetSubmit } from './DeviceOptions-e3065976.js';
import { H as HorizontalField } from './HorizontalField-8c3fab80.js';
import { g as getRemoteContext, s as storeEntries, a as storeKeys } from './_layout.svelte-669347b1.js';
import { p as post, P as PowerButtons } from './_PowerButtons-76b61d89.js';
import './stores-1982239f.js';
import './TopBar-debc3b53.js';
import './index2-505c6d08.js';
import './web-ec6e3b01.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  connection = connectionToString(selectedCell?.connection);
  $$unsubscribe_remoteState();
  $$unsubscribe_devicesIds();
  $$unsubscribe_devices();
  return `${validate_component(Form, "Form").$$render(
    $$result,
    {
      class: "flex flex-col gap-y-4",
      action: "/api/device/info/" + selectedDeviceSerial,
      onSubmit: submit
    },
    {},
    {
      default: ({ loading }) => {
        return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
          default: ({ inputClassName }) => {
            return `<select${add_attribute("class", inputClassName, 0)} name="serial" id="control-serial">${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-connection",
            label: "Connection"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<input id="control-connection" name="connection" type="text"${add_attribute("value", connection, 0)} readonly class="${escape(inputClassName, true) + " bg-slate-300"}">`;
            }
          }
        )} ${selectedCell?.connection?.includes("android") ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
          default: () => {
            return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
          }
        })}` : ``} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-deviceName",
            label: "Device Name"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<input id="control-deviceName"${add_attribute("class", inputClassName, 0)} name="deviceName" type="text"${add_attribute("value", selectedCell?.info?.deviceName ?? "", 0)} placeholder="Pixel 10">`;
            }
          }
        )} ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-width", label: "Width" }, {}, {
          default: ({ inputClassName }) => {
            return `<input id="control-width"${add_attribute("class", inputClassName, 0)} name="width" type="number"${add_attribute("min", 0, 0)}${add_attribute("value", selectedCell?.info?.width ?? "", 0)} placeholder="900">`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-height", label: "Height" }, {}, {
          default: ({ inputClassName }) => {
            return `<input id="control-height"${add_attribute("class", inputClassName, 0)} name="height" type="number"${add_attribute("min", 0, 0)}${add_attribute("value", selectedCell?.info?.height ?? "", 0)} placeholder="2100">`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-x", label: "X Position" }, {}, {
          default: ({ inputClassName }) => {
            return `<input id="control-x"${add_attribute("class", inputClassName, 0)} name="x" type="number"${add_attribute("value", selectedCell?.info?.x ?? "", 0)} placeholder="10">`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-y", label: "Y Position" }, {}, {
          default: ({ inputClassName }) => {
            return `<input id="control-y"${add_attribute("class", inputClassName, 0)} name="y" type="number"${add_attribute("value", selectedCell?.info?.y ?? "", 0)} placeholder="0">`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-server",
            label: "Asset Server"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<input id="control-server"${add_attribute("class", inputClassName, 0)} name="server" type="url"${add_attribute("value", selectedCell?.info?.server ?? "", 0)} placeholder="http://192.168.0.1">`;
            }
          }
        )} ${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
      }
    }
  )}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-f51c2b42.js.map
