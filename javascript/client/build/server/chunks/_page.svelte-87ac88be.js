import { c as create_ssr_component, e as escape, v as validate_component, a as add_attribute, s as subscribe } from './ssr-966736c7.js';
import { F as Form, D as DeviceOptions, R as ResetSubmit } from './DeviceOptions-e3065976.js';
import { L as Label, H as HorizontalField } from './HorizontalField-8c3fab80.js';
import { g as getRemoteContext, s as storeEntries, a as storeKeys } from './_layout.svelte-669347b1.js';
import './stores-1982239f.js';
import './TopBar-debc3b53.js';
import './index2-505c6d08.js';
import './web-ec6e3b01.js';

const INPUT_CLASSES = "block w-full shadow-sm sm:text-sm border-gray-300 rounded-md";
const VerticalField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { for: htmlFor = void 0 } = $$props;
  let { label } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0)
    $$bindings.for(htmlFor);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  return `<div class="${"text-black " + escape(className, true)}">${validate_component(Label, "Label").$$render($$result, { class: "mb-1", for: htmlFor }, {}, {
    default: () => {
      return `${escape(label)}`;
    }
  })} ${slots.default ? slots.default({ inputClassName: INPUT_CLASSES }) : ` <input type="text"${add_attribute("id", htmlFor, 0)}${add_attribute("class", INPUT_CLASSES, 0)}> `}</div>`;
});

async function submit(data, action) {
  const backgroundColor = data.get("backgroundColor");
  if (backgroundColor !== "#ffffff") {
    action.searchParams.set("backgroundColor", backgroundColor);
  }
  action.searchParams.set("rest", data.get("rest"));
  action.searchParams.set("delay", data.get("delay"));
  data.getAll("device").forEach((deviceId) => {
    action.searchParams.append("device", deviceId);
  });
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $deviceIds, $$unsubscribe_deviceIds;
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  const devices = storeEntries(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  const deviceIds = storeKeys(remoteState);
  $$unsubscribe_deviceIds = subscribe(deviceIds, (value) => $deviceIds = value);
  $$unsubscribe_deviceIds();
  $$unsubscribe_devices();
  return `${validate_component(Form, "Form").$$render(
    $$result,
    {
      class: "flex flex-col gap-y-4",
      action: "/api/action/text",
      onSubmit: submit
    },
    {},
    {
      default: ({ loading }) => {
        return `${validate_component(VerticalField, "VerticalField").$$render($$result, { for: "control-text", label: "Text" }, {}, {
          default: ({ inputClassName }) => {
            return `<textarea${add_attribute("class", inputClassName, 0)} required id="control-text" name="text" rows="10" placeholder=" Apple 
 Banana 
 Carrot"></textarea>`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-color",
            label: "Background Color"
          },
          {},
          {
            default: () => {
              return `<input id="control-color" name="backgroundColor" type="color" value="#ffffff">`;
            }
          }
        )} ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Devices" }, {}, {
          default: ({ inputClassName }) => {
            return `<select multiple name="device" id="control-serial"${add_attribute("class", inputClassName, 0)}${add_attribute("value", $deviceIds, 0)}>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-rest",
            label: "Remaining Cells"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<select id="control-rest" name="rest"${add_attribute("class", inputClassName, 0)}><option value="ignore" data-svelte-h="svelte-u6vf1u">Ignore</option><option value="blank" data-svelte-h="svelte-1u68x92">Blank</option><option value="off" data-svelte-h="svelte-14ilfoc">Off</option></select>`;
            }
          }
        )} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-delay",
            label: "Update delay"
          },
          {},
          {
            default: () => {
              return `<input id="control-delay" name="delay" type="number" value="0">`;
            }
          }
        )} ${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
      }
    }
  )}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-87ac88be.js.map
