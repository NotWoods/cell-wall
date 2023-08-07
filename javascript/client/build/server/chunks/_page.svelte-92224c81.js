import { c as create_ssr_component, s as subscribe, v as validate_component, e as escape, f as each, a as add_attribute } from './ssr-966736c7.js';
import { D as DeviceOptions, F as Form, R as ResetSubmit } from './DeviceOptions-e3065976.js';
import { H as HorizontalField } from './HorizontalField-8c3fab80.js';
import { g as getRemoteContext, s as storeEntries } from './_layout.svelte-669347b1.js';
import { a as cellStateBlankSchema, d as cellStateClockSchema, e as cellStateBusySchema, f as cellStateImageSchema, g as cellStateTextSchema, h as cellStateWebSchema } from './web-ec6e3b01.js';
import { a as RandomColor } from './color-e99104bb.js';
import startCase from 'lodash.startcase';
import { p as post, P as PowerButtons } from './_PowerButtons-76b61d89.js';
import './stores-1982239f.js';
import './TopBar-debc3b53.js';
import './index2-505c6d08.js';
import './random-c2405d3d.js';

const allCellStateSchemas = [
  cellStateBlankSchema,
  cellStateClockSchema,
  cellStateBusySchema,
  cellStateImageSchema,
  cellStateTextSchema,
  cellStateWebSchema
];
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<ul class="flex flex-wrap border-b-2 border-slate-700" role="tablist">${slots.default ? slots.default({}) : ``}</ul>`;
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
      return `${Array.isArray(property.enum) ? `<select id="${"control-" + escape(name, true)}"${add_attribute("name", name, 0)}${add_attribute("class", inputClassName, 0)}>${each(property.enum, (option) => {
        return `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`;
      })}</select>` : `<input id="${"control-" + escape(name, true)}"${add_attribute("list", examples ? `list-${name}` : void 0, 0)}${add_attribute("class", type === "color" ? "" : inputClassName, 0)}${add_attribute("name", name, 0)}${add_attribute("type", type, 0)} ${required ? "required" : ""}${add_attribute("value", typeof value === "string" ? value : fallback, 0)}> ${examples ? `<datalist id="${"list-" + escape(name, true)}">${each(examples, (example) => {
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
  required = new Set(schema?.required || []);
  properties = Object.entries(schema?.properties || {}).filter(([name]) => name !== "type").map(([name, property]) => ({ name, property }));
  return `${each(properties, ({ name, property }) => {
    return `${validate_component(ControllerField, "ControllerField").$$render(
      $$result,
      {
        name,
        property,
        required: required.has(name),
        value: state?.[name]
      },
      {},
      {}
    )}`;
  })}`;
});
const Tab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { selected = false } = $$props;
  let { controls } = $$props;
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.controls === void 0 && $$bindings.controls && controls !== void 0)
    $$bindings.controls(controls);
  return `<li class="inline-block"><button type="button" class="${[
    "border-b-2 -mb-[2px] px-4 py-2 transition-colors",
    (selected ? "text-green-400" : "") + " " + (selected ? "border-current" : "") + " " + (!selected ? "border-transparent" : "") + " " + (!selected ? "hover:border-white" : "")
  ].join(" ").trim()}" role="tab"${add_attribute("aria-selected", selected, 0)}${add_attribute("aria-controls", controls, 0)}>${slots.default ? slots.default({}) : ``}</button></li>`;
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
  return `${validate_component(Tab, "Tab").$$render(
    $$result,
    {
      selected: type === selectedType,
      controls: "custom-form"
    },
    {},
    {
      default: () => {
        return `${escape(typeName)}`;
      }
    }
  )}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedDevice;
  let activeSchema;
  let $remoteState, $$unsubscribe_remoteState;
  let $devices, $$unsubscribe_devices;
  let { data } = $$props;
  const { state: remoteState } = getRemoteContext();
  $$unsubscribe_remoteState = subscribe(remoteState, (value) => $remoteState = value);
  const devices = storeEntries(remoteState);
  $$unsubscribe_devices = subscribe(devices, (value) => $devices = value);
  let selectedType = "BLANK";
  let selectedDeviceSerial = data.defaultSerial || "";
  async function submit(formData, action) {
    const data2 = Object.fromEntries(formData);
    await post(action.toString(), { ...data2, type: selectedType });
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    selectedDevice = $remoteState.get(selectedDeviceSerial);
    activeSchema = allCellStateSchemas.find((schema) => schema.properties.type.const === selectedType);
    $$rendered = `<div class="flex flex-col gap-y-4 px-2 mb-4">${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Device" }, {}, {
      default: ({ inputClassName }) => {
        return `<select class="${escape(inputClassName, true) + " cursor-pointer"}" id="control-serial" form="custom-form"><option value="" data-svelte-h="svelte-lc7nb8">All devices</option>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
      }
    })} ${!selectedDevice || selectedDevice?.connection?.includes("android") ? `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { label: "Power" }, {}, {
      default: () => {
        return `${validate_component(PowerButtons, "PowerButtons").$$render($$result, { serial: selectedDeviceSerial }, {}, {})}`;
      }
    })}` : ``}</div> <nav class="mb-6">${validate_component(Tabs, "Tabs").$$render($$result, {}, {}, {
      default: () => {
        return `${each(allCellStateSchemas, (schema) => {
          return `${validate_component(TypeTab, "TypeTab").$$render(
            $$result,
            { schema, selectedType },
            {
              selectedType: ($$value) => {
                selectedType = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        })}`;
      }
    })}</nav> ${validate_component(Form, "Form").$$render(
      $$result,
      {
        id: "custom-form",
        class: "flex flex-col gap-y-4 px-2",
        role: "tabpanel",
        action: "/api/device/state/" + selectedDeviceSerial,
        onSubmit: submit
      },
      {},
      {
        default: ({ loading }) => {
          return `${validate_component(ControllerFields, "ControllerFields").$$render(
            $$result,
            {
              schema: activeSchema,
              state: selectedDevice?.state
            },
            {},
            {}
          )} ${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_remoteState();
  $$unsubscribe_devices();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-92224c81.js.map
