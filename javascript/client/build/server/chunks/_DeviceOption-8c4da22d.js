import { c as create_ssr_component, e as escape, v as validate_component, b as add_attribute } from "./index-50854321.js";
import { L as Label } from "./SubmitButton-185fe575.js";
function createLoadWithDevices() {
  return async ({ fetch }) => {
    const res = await fetch(`/api/device/`);
    if (res.ok) {
      return {
        props: {
          devices: Object.values(await res.json())
        }
      };
    } else if (res.status === 404 || res.status === 301) {
      return {
        props: {
          devices: []
        }
      };
    } else {
      return {
        status: res.status,
        error: new Error(`Could not load devices, ${res.statusText}`)
      };
    }
  };
}
const INPUT_CLASSES = "block w-full shadow-sm sm:text-sm border-gray-300 rounded-md flex-1";
const HorizontalField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { for: htmlFor = void 0 } = $$props;
  let { label } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0)
    $$bindings.for(htmlFor);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  return `<div class="${"flex flex-col sm:flex-row sm:items-center text-black " + escape(className)}">${validate_component(Label, "Label").$$render($$result, {
    class: "mb-4 sm:mb-0 sm:mr-4 flex-initial w-36",
    for: htmlFor
  }, {}, {
    default: () => {
      return `${escape(label)}`;
    }
  })}
	${slots.default ? slots.default({ inputClassName: INPUT_CLASSES }) : `
		<input type="${"text"}"${add_attribute("id", htmlFor, 0)}${add_attribute("class", INPUT_CLASSES, 0)}>
	`}</div>`;
});
const DeviceOption = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { device } = $$props;
  if ($$props.device === void 0 && $$bindings.device && device !== void 0)
    $$bindings.device(device);
  return `<option${add_attribute("value", device.serial, 0)} ${!device.connected ? "disabled" : ""}>${escape(device.info?.deviceName || device.serial)}</option>`;
});
export { DeviceOption as D, HorizontalField as H, createLoadWithDevices as c };
