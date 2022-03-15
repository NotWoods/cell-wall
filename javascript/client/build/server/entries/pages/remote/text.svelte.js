import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute, p as each } from "../../../chunks/index-4d214b4e.js";
import { R as ResetSubmit } from "../../../chunks/ResetSubmit-c389bea7.js";
import { H as HorizontalField, D as DeviceOption } from "../../../chunks/HorizontalField-ca2aa46e.js";
import { V as VerticalField } from "../../../chunks/VerticalField-03539574.js";
import { F as Form } from "../../../chunks/SubmitButton-5db79bf7.js";
import { g as getRemoteContext, s as storeValues } from "../../../chunks/__layout-905ad6c6.js";
import "../../../chunks/snackbar-host-f2ed4131.js";
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
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  const devices = storeValues(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
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
          return `<select multiple name="${"device"}" id="${"control-serial"}"${add_attribute("class", inputClassName, 0)}${add_attribute("value", $devices.map((device) => device.serial), 0)}>${each($devices, (device) => {
            return `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`;
          })}</select>`;
        }
      })}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
    }
  })}`;
});
export { Text as default, prerender };
