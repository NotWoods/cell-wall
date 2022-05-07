import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute } from "../../../chunks/index-07af9b00.js";
import { D as DeviceOptions, R as ResetSubmit } from "../../../chunks/DeviceOptions-e1dca499.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-06a204be.js";
import { V as VerticalField } from "../../../chunks/VerticalField-5755d773.js";
import { F as Form } from "../../../chunks/Form-4d58a7fa.js";
import { g as getRemoteContext, s as storeEntries, a as storeKeys } from "../../../chunks/__layout-2cd46b02.js";
import "../../../chunks/Label-f2ecd148.js";
import "../../../chunks/snackbar-host-2ba8754b.js";
import "../../../chunks/web-9fac8a47.js";
import "../../../chunks/TopBar-adef7ba1.js";
async function submit(data, action) {
  const backgroundColor = data.get("backgroundColor");
  if (backgroundColor !== "#ffffff") {
    action.searchParams.set("backgroundColor", backgroundColor);
  }
  action.searchParams.set("rest", data.get("rest"));
  action.searchParams.set("delay", data.get("delay"));
  try {
    const res = await fetch(action.toString(), {
      method: "post",
      headers: { "content-type": "text/plain" },
      body: data.get("text")
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $deviceIds, $$unsubscribe_deviceIds;
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  const devices = storeEntries(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  const deviceIds = storeKeys(remoteState);
  $$unsubscribe_deviceIds = subscribe(deviceIds, (value) => $deviceIds = value);
  $$unsubscribe_deviceIds();
  $$unsubscribe_devices();
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex flex-col gap-y-4",
    action: "/api/action/text",
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      return `${validate_component(VerticalField, "VerticalField").$$render($$result, { for: "control-text", label: "Text" }, {}, {
        default: ({ inputClassName }) => {
          return `<textarea${add_attribute("class", inputClassName, 0)} required id="${"control-text"}" name="${"text"}" rows="${"10"}" placeholder="${" Apple \r Banana \r Carrot"}"></textarea>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-color",
        label: "Background Color"
      }, {}, {
        default: () => {
          return `<input id="${"control-color"}" name="${"backgroundColor"}" type="${"color"}" value="${"#ffffff"}">`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Devices" }, {}, {
        default: ({ inputClassName }) => {
          return `<select multiple name="${"device"}" id="${"control-serial"}"${add_attribute("class", inputClassName, 0)}${add_attribute("value", $deviceIds, 0)}>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-rest",
        label: "Remaining Cells"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<select id="${"control-rest"}" name="${"rest"}"${add_attribute("class", inputClassName, 0)}><option value="${"ignore"}">Ignore</option><option value="${"blank"}">Blank</option><option value="${"off"}">Off</option></select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-delay",
        label: "Update delay"
      }, {}, {
        default: () => {
          return `<input id="${"control-delay"}" name="${"delay"}" type="${"number"}" value="${"0"}">`;
        }
      })}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Text as default };
