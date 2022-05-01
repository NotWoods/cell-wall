import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute } from "../../../chunks/index-0b76d127.js";
import { D as DeviceOptions, R as ResetSubmit } from "../../../chunks/DeviceOptions-e9c692cd.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-43bf7a7b.js";
import { V as VerticalField } from "../../../chunks/VerticalField-29c6c230.js";
import { F as Form } from "../../../chunks/Form-8ab490a9.js";
import { g as getRemoteContext, s as storeEntries, a as storeKeys } from "../../../chunks/__layout-8f35b6a8.js";
import "../../../chunks/Label-a17ce47a.js";
import "../../../chunks/snackbar-host-fe054673.js";
import "../../../chunks/web-9961d8d9.js";
import "../../../chunks/index-441a7cba.js";
import "../../../chunks/TopBar-a3c8c5c4.js";
const prerender = true;
async function submit(data, action) {
  const backgroundColor = data.get("backgroundColor");
  if (backgroundColor !== "#ffffff") {
    action.searchParams.set("backgroundColor", backgroundColor);
  }
  action.searchParams.set("rest", data.get("rest"));
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

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Text as default, prerender };
