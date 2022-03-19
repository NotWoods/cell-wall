import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute } from "../../../chunks/index-4d214b4e.js";
import { R as ResetSubmit } from "../../../chunks/ResetSubmit-703d5a7b.js";
import { D as DeviceOptions } from "../../../chunks/DeviceOptions-8dcbbe6c.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-12292c4d.js";
import { V as VerticalField } from "../../../chunks/VerticalField-55978348.js";
import { F as Form } from "../../../chunks/SubmitButton-c96a2606.js";
import { a as getRemoteContext, s as storeEntries, b as storeKeys } from "../../../chunks/__layout-828ca917.js";
import "../../../chunks/LoadingSpinner-97b51d95.js";
import "../../../chunks/snackbar-host-d6555a45.js";
import "../../../chunks/cell-state-schema-b294815b.js";
import "../../../chunks/index-23b4b723.js";
import "../../../chunks/TopBar-fb618005.js";
const prerender = true;
async function submit(data, action) {
  const backgroundColor = data.get("backgroundColor");
  if (backgroundColor !== "#ffffff") {
    action.searchParams.set("backgroundColor", backgroundColor);
  }
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

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Text as default, prerender };
