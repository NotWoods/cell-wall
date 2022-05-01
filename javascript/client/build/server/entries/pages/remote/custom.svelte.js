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
import { c as create_ssr_component, f as each, v as validate_component, e as escape, b as add_attribute, a as subscribe } from "../../../chunks/index-0b76d127.js";
import { D as DeviceOptions, R as ResetSubmit } from "../../../chunks/DeviceOptions-e9c692cd.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-43bf7a7b.js";
import { F as Form } from "../../../chunks/Form-8ab490a9.js";
import { g as getRemoteContext, s as storeEntries } from "../../../chunks/__layout-8f35b6a8.js";
import { a as cellStateBlankSchema, d as cellStateClockSchema, e as cellStateImageSchema, f as cellStateTextSchema, g as cellStateWebSchema } from "../../../chunks/web-9961d8d9.js";
import startCase from "lodash.startcase";
import { P as PowerButtons } from "../../../chunks/_PowerButtons-2d0d6690.js";
import { p as post } from "../../../chunks/_form-52443b97.js";
import "../../../chunks/Label-a17ce47a.js";
import "../../../chunks/snackbar-host-fe054673.js";
import "../../../chunks/index-441a7cba.js";
import "../../../chunks/TopBar-a3c8c5c4.js";
const allCellStateSchemas = [
  cellStateBlankSchema,
  cellStateClockSchema,
  cellStateImageSchema,
  cellStateTextSchema,
  cellStateWebSchema
];
const RAINBOW_COLORS = [
  "#0F172A",
  "#7F1D1D",
  "#7C2D12",
  "#78350F",
  "#713F12",
  "#365314",
  "#14532D",
  "#064E3B",
  "#134E4A",
  "#164E63",
  "#0C4A6E",
  "#1E3A8A",
  "#312E81",
  "#4C1D95",
  "#581C87",
  "#701A75",
  "#831843",
  "#881337"
];
class RandomColor {
  constructor(colors = RAINBOW_COLORS) {
    this.colors = colors;
    if (colors.length === 0) {
      throw new TypeError("No colors provided");
    }
    this.reset();
  }
  reset() {
    this.unusedColors = this.colors.slice();
  }
  next() {
    if (this.unusedColors.length <= 1) {
      const color2 = this.unusedColors[0];
      this.reset();
      return color2;
    }
    const randomIndex = Math.floor(Math.random() * this.unusedColors.length);
    const color = this.unusedColors[randomIndex];
    this.unusedColors.splice(randomIndex, 1);
    return color;
  }
}
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<ul class="${"flex flex-wrap border-b-2 border-slate-700"}" role="${"tablist"}">${slots.default ? slots.default({}) : ``}</ul>`;
});
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
const ControllerFields = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let required;
  let properties;
  const randomColor = new RandomColor();
  let { schema } = $$props;
  let { state = void 0 } = $$props;
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  required = new Set((schema == null ? void 0 : schema.required) || []);
  properties = Object.entries((schema == null ? void 0 : schema.properties) || {}).filter(([name]) => name !== "type").map(([name, property]) => {
    const type = getInputType(name, property);
    return {
      name,
      label: property.title ?? startCase(name),
      property,
      type,
      fallback: type === "color" ? randomColor.next() : ""
    };
  });
  return `${each(properties, ({ name, label, type, property, fallback }) => {
    return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-" + name, label }, {}, {
      default: ({ inputClassName }) => {
        return `${Array.isArray(property.enum) ? `<select id="${"control-" + escape(name)}"${add_attribute("name", name, 0)}${add_attribute("class", inputClassName, 0)}>${each(property.enum, (option) => {
          return `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`;
        })}</select>` : `<input id="${"control-" + escape(name)}"${add_attribute("class", type === "color" ? "" : inputClassName, 0)}${add_attribute("name", name, 0)}${add_attribute("type", type, 0)} ${required.has(name) ? "required" : ""}${add_attribute("value", (state == null ? void 0 : state[name]) ?? fallback, 0)}>`}
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
const Custom = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedDevice;
  let activeSchema;
  let $remoteState, $$unsubscribe_remoteState;
  let $devices, $$unsubscribe_devices;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  const devices = storeEntries(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  let selectedType = "BLANK";
  let selectedDeviceSerial = "";
  async function submit(formData, action) {
    const data = Object.fromEntries(formData);
    await post(action.toString(), __spreadProps(__spreadValues({}, data), { type: selectedType }));
  }
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    selectedDevice = $remoteState.get(selectedDeviceSerial);
    activeSchema = allCellStateSchemas.find((schema) => schema.properties.type.const === selectedType);
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
        var _a;
        return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
          default: ({ inputClassName }) => {
            return `<select class="${escape(inputClassName) + " cursor-pointer"}" id="${"control-serial"}"><option value="${""}">All devices</option>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
          }
        })}

	${!selectedDevice || ((_a = selectedDevice == null ? void 0 : selectedDevice.connection) == null ? void 0 : _a.includes("android")) ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
          default: () => {
            return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
          }
        })}` : ``}

	${validate_component(ControllerFields, "ControllerFields").$$render($$result, {
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
export { Custom as default };
