var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { c as create_ssr_component, v as validate_component, e as escape, b as add_attribute, f as each, a as subscribe } from "../../../chunks/index-07af9b00.js";
import { D as DeviceOptions, R as ResetSubmit } from "../../../chunks/DeviceOptions-e1dca499.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-06a204be.js";
import { F as Form } from "../../../chunks/Form-4d58a7fa.js";
import { g as getRemoteContext, s as storeEntries } from "../../../chunks/__layout-2cd46b02.js";
import { a as cellStateBlankSchema, e as cellStateClockSchema, f as cellStateBusySchema, g as cellStateImageSchema, h as cellStateTextSchema, i as cellStateWebSchema } from "../../../chunks/web-9fac8a47.js";
import { a as RandomColor } from "../../../chunks/color-8cc37c09.js";
import startCase from "lodash.startcase";
import { P as PowerButtons } from "../../../chunks/_PowerButtons-f93d2f32.js";
import { p as post } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/Label-f2ecd148.js";
import "../../../chunks/snackbar-host-2ba8754b.js";
import "../../../chunks/TopBar-adef7ba1.js";
import "../../../chunks/random-ca7fbb84.js";
const allCellStateSchemas = [
  cellStateBlankSchema,
  cellStateClockSchema,
  cellStateBusySchema,
  cellStateImageSchema,
  cellStateTextSchema,
  cellStateWebSchema
];
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<ul class="${"flex flex-wrap border-b-2 border-slate-700"}" role="${"tablist"}">${slots.default ? slots.default({}) : ``}</ul>`;
});
const randomColor = new RandomColor();
function getInputType(name, property) {
  if (Array.isArray(property.enum))
    return "select";
  if (name.endsWith("Color"))
    return "color";
  switch (property.type) {
    case "number":
      return "number";
    case "string":
      if (property.format === "uri")
        return "url";
    default:
      return "text";
  }
}
const ControllerField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let label;
  let type;
  let fallback;
  let examples;
  let { name } = $$props;
  let { property } = $$props;
  let { required } = $$props;
  let { value } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.property === void 0 && $$bindings.property && property !== void 0)
    $$bindings.property(property);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  label = property.title ?? startCase(name);
  type = getInputType(name, property);
  fallback = type === "color" ? randomColor.next() : "";
  examples = property.examples && property.examples.length > 0 ? property.examples : void 0;
  return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-" + name, label }, {}, {
    default: ({ inputClassName }) => {
      return `${Array.isArray(property.enum) ? `<select id="${"control-" + escape(name)}"${add_attribute("name", name, 0)}${add_attribute("class", inputClassName, 0)}>${each(property.enum, (option) => {
        return `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`;
      })}</select>` : `<input id="${"control-" + escape(name)}"${add_attribute("list", examples ? `list-${name}` : void 0, 0)}${add_attribute("class", type === "color" ? "" : inputClassName, 0)}${add_attribute("name", name, 0)}${add_attribute("type", type, 0)} ${required ? "required" : ""}${add_attribute("value", typeof value === "string" ? value : fallback, 0)}>
		${examples ? `<datalist id="${"list-" + escape(name)}">${each(examples, (example) => {
        return `<option${add_attribute("value", example, 0)}></option>`;
      })}</datalist>` : ``}`}`;
    }
  })}`;
});
const ControllerFields = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let required;
  let properties;
  let { schema } = $$props;
  let { state = void 0 } = $$props;
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  required = new Set((schema == null ? void 0 : schema.required) || []);
  properties = Object.entries((schema == null ? void 0 : schema.properties) || {}).filter(([name]) => name !== "type").map(([name, property]) => ({ name, property }));
  return `${each(properties, ({ name, property }) => {
    return `${validate_component(ControllerField, "ControllerField").$$render($$result, {
      name,
      property,
      required: required.has(name),
      value: state == null ? void 0 : state[name]
    }, {}, {})}`;
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
  type = schema.properties.type.const;
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
const load = async ({ url }) => {
  return {
    props: {
      defaultSerial: url.searchParams.get("id") || ""
    }
  };
};
const Custom = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let selectedDevice;
  let activeSchema;
  let $remoteState, $$unsubscribe_remoteState;
  let $devices, $$unsubscribe_devices;
  let { defaultSerial } = $$props;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  const devices = storeEntries(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  let selectedType = "BLANK";
  let selectedDeviceSerial = defaultSerial || "";
  async function submit(formData, action) {
    const data = Object.fromEntries(formData);
    await post(action.toString(), __spreadProps(__spreadValues({}, data), { type: selectedType }));
  }
  if ($$props.defaultSerial === void 0 && $$bindings.defaultSerial && defaultSerial !== void 0)
    $$bindings.defaultSerial(defaultSerial);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        selectedDeviceSerial = defaultSerial;
      }
    }
    selectedDevice = $remoteState.get(selectedDeviceSerial);
    activeSchema = allCellStateSchemas.find((schema) => schema.properties.type.const === selectedType);
    $$rendered = `<div class="${"flex flex-col gap-y-4 px-2 mb-4"}">${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
      default: ({ inputClassName }) => {
        return `<select class="${escape(inputClassName) + " cursor-pointer"}" id="${"control-serial"}" form="${"custom-form"}"><option value="${""}">All devices</option>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
      }
    })}

	${!selectedDevice || ((_a = selectedDevice == null ? void 0 : selectedDevice.connection) == null ? void 0 : _a.includes("android")) ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
      default: () => {
        return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
      }
    })}` : ``}</div>

<nav class="${"mb-6"}">${validate_component(Tabs, "Tabs").$$render($$result, {}, {}, {
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
        return `${validate_component(ControllerFields, "ControllerFields").$$render($$result, {
          schema: activeSchema,
          state: selectedDevice == null ? void 0 : selectedDevice.state
        }, {}, {})}

	${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_remoteState();
  $$unsubscribe_devices();
  return $$rendered;
});
export { Custom as default, load };
