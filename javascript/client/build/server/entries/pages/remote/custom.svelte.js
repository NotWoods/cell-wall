import { c as create_ssr_component, p as each, v as validate_component, e as escape, b as add_attribute, a as subscribe } from "../../../chunks/index-4d214b4e.js";
import { R as ResetSubmit } from "../../../chunks/ResetSubmit-c389bea7.js";
import { H as HorizontalField, D as DeviceOption } from "../../../chunks/HorizontalField-ca2aa46e.js";
import { F as Form } from "../../../chunks/SubmitButton-5db79bf7.js";
import { g as getRemoteContext, s as storeValues } from "../../../chunks/__layout-905ad6c6.js";
import { g as getTypeFromSchema, a as allCellStateSchemas } from "../../../chunks/schema-7c735d14.js";
import startCase from "lodash.startcase";
import { P as PowerButtons } from "../../../chunks/_PowerButtons-ce1efc0a.js";
import { p as post } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/snackbar-host-f2ed4131.js";
import "../../../chunks/index-23b4b723.js";
import "../../../chunks/TopBar-fb618005.js";
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<ul class="${"flex flex-wrap border-b-2 border-slate-700"}" role="${"tablist"}">${slots.default ? slots.default({}) : ``}</ul>`;
});
function getInputType(name, property) {
  if (Array.isArray(property.enum))
    return "select";
  if (name.endsWith("Color"))
    return "color";
  if (property.format === "uri")
    return "url";
  switch (property.type) {
    case "number":
      return "number";
    default:
      return "text";
  }
}
const ControllerFields = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let getInputName;
  let required;
  let properties;
  let { schema } = $$props;
  let { state = void 0 } = $$props;
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  getInputName = (name) => {
    if (name === "payload") {
      const type = schema?.properties?.type?.enum?.[0];
      switch (type) {
        case "WEB":
          return "URL";
        case "IMAGE":
          return "Source";
        case "TEXT":
          return "Text";
        default:
          return startCase(name);
      }
    }
    return startCase(name);
  };
  required = new Set(schema?.required || []);
  properties = Object.entries(schema?.properties || {}).filter(([name]) => name !== "type").map(([name, property]) => ({
    name,
    property,
    type: getInputType(name, property)
  }));
  return `${each(properties, ({ name, type, property }) => {
    return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
      for: "control-" + name,
      label: getInputName(name)
    }, {}, {
      default: ({ inputClassName }) => {
        return `${Array.isArray(property.enum) ? `<select id="${"control-" + escape(name)}"${add_attribute("name", name, 0)}${add_attribute("class", inputClassName, 0)}>${each(property.enum, (option) => {
          return `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`;
        })}</select>` : `<input id="${"control-" + escape(name)}"${add_attribute("class", type === "color" ? "" : inputClassName, 0)}${add_attribute("name", name, 0)}${add_attribute("type", type, 0)} ${required.has(name) ? "required" : ""}${add_attribute("value", state?.[name] ?? "", 0)}>`}
	`;
      }
    })}`;
  })}`;
});
const Tab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { selected = false } = $$props;
  let { controls } = $$props;
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.controls === void 0 && $$bindings.controls && controls !== void 0)
    $$bindings.controls(controls);
  return `<li class="${"inline-block"}"><button type="${"button"}" class="${[
    "border-b-2 -mb-[2px] px-4 py-2 transition-colors",
    (selected ? "text-green-400" : "") + " " + (selected ? "border-current" : "") + " " + (!selected ? "border-transparent" : "") + " " + (!selected ? "hover:border-white" : "")
  ].join(" ").trim()}" role="${"tab"}"${add_attribute("aria-selected", selected, 0)}${add_attribute("aria-controls", controls, 0)}>${slots.default ? slots.default({}) : ``}</button></li>`;
});
const TypeTab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let type;
  let typeName;
  let { selectedType } = $$props;
  let { schema } = $$props;
  if ($$props.selectedType === void 0 && $$bindings.selectedType && selectedType !== void 0)
    $$bindings.selectedType(selectedType);
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  type = getTypeFromSchema(schema);
  typeName = startCase(type.toLocaleLowerCase());
  return `${validate_component(Tab, "Tab").$$render($$result, {
    selected: type === selectedType,
    controls: "custom-form"
  }, {}, {
    default: () => {
      return `${escape(typeName)}`;
    }
  })}`;
});
const Custom = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedDevice;
  let activeSchema;
  let $remoteState, $$unsubscribe_remoteState;
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  const devices = storeValues(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  let selectedType = "BLANK";
  let selectedDeviceSerial = "";
  async function submit(formData, action) {
    const data = Object.fromEntries(formData);
    await post(action.toString(), { ...data, type: selectedType });
  }
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    selectedDevice = $remoteState.get(selectedDeviceSerial);
    activeSchema = allCellStateSchemas.find((schema) => getTypeFromSchema(schema) === selectedType);
    $$rendered = `<nav class="${"mb-6"}">${validate_component(Tabs, "Tabs").$$render($$result, {}, {}, {
      default: () => {
        return `${each(allCellStateSchemas, (schema) => {
          return `${validate_component(TypeTab, "TypeTab").$$render($$result, { schema, selectedType }, {
            selectedType: ($$value) => {
              selectedType = $$value;
              $$settled = false;
            }
          }, {})}`;
        })}`;
      }
    })}</nav>

${validate_component(Form, "Form").$$render($$result, {
      id: "custom-form",
      class: "flex flex-col gap-y-4 px-2",
      role: "tabpanel",
      action: "/api/device/state/" + selectedDeviceSerial,
      onSubmit: submit
    }, {}, {
      default: ({ loading }) => {
        return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
          default: ({ inputClassName }) => {
            return `<select class="${escape(inputClassName) + " cursor-pointer"}" id="${"control-serial"}"><option value="${""}">All devices</option>${each($devices, (device) => {
              return `${validate_component(DeviceOption, "DeviceOption").$$render($$result, { device }, {}, {})}`;
            })}</select>`;
          }
        })}

	${selectedDevice?.connection === "android" ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
          default: () => {
            return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
          }
        })}` : ``}

	${validate_component(ControllerFields, "ControllerFields").$$render($$result, {
          schema: activeSchema,
          state: selectedDevice?.state
        }, {}, {})}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_remoteState();
  $$unsubscribe_devices();
  return $$rendered;
});
export { Custom as default };
