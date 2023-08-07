import { c as create_ssr_component, s as subscribe, v as validate_component, e as escape, a as add_attribute, k as compute_rest_props, l as spread, m as escape_object } from './ssr-966736c7.js';
import { F as Form, D as DeviceOptions, R as ResetSubmit } from './DeviceOptions-e3065976.js';
import { H as HorizontalField } from './HorizontalField-8c3fab80.js';
import { g as getRemoteContext, s as storeEntries, a as storeKeys } from './_layout.svelte-669347b1.js';
import './stores-1982239f.js';
import './TopBar-debc3b53.js';
import './index2-505c6d08.js';
import './web-ec6e3b01.js';

const FileInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<label class="file-label relative w-full shadow-sm rounded-md flex-1 bg-white border border-gray-300"><input${spread(
    [
      escape_object($$restProps),
      {
        class: "file-input absolute inset-0 rounded-md w-full cursor-pointer"
      },
      { type: "file" }
    ],
    {}
  )}> <div class="relative flex pointer-events-none cursor-pointer"><span class="inline-flex items-center px-3 rounded-l-md border-r border-gray-300 bg-gray-50 text-gray-500 text-sm" aria-hidden="true" data-svelte-h="svelte-1asnlcw"><svg class="fill-current mr-1" width="24" height="24" viewBox="4 3 18 17"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"></path></svg>
			Choose a file…</span> <span class="flex-1 block bg-white w-full rounded-none rounded-r-md sm:text-sm border-gray-300 px-3 py-2" aria-hidden="true">${slots.default ? slots.default({}) : ``}</span></div></label>`;
});
async function submit(data, action) {
  const image = data.get("image");
  data.delete("image");
  for (const [key, value] of data) {
    action.searchParams.append(key, value);
  }
  try {
    const res = await fetch(action.toString(), {
      method: "post",
      headers: { "content-type": image.type },
      body: image
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
  let fileName = "No file selected.";
  $$unsubscribe_deviceIds();
  $$unsubscribe_devices();
  return `${validate_component(Form, "Form").$$render(
    $$result,
    {
      class: "flex flex-col gap-y-4",
      action: "/api/action/image/",
      onSubmit: submit
    },
    {},
    {
      default: ({ loading }) => {
        return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-image", label: "Image" }, {}, {
          default: () => {
            return `${validate_component(FileInput, "FileInput").$$render(
              $$result,
              {
                required: true,
                accept: "image/*",
                name: "image",
                id: "control-image"
              },
              {},
              {
                default: () => {
                  return `${escape(fileName)}`;
                }
              }
            )}`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Devices" }, {}, {
          default: ({ inputClassName }) => {
            return `<select multiple name="device" id="control-serial"${add_attribute("class", inputClassName, 0)}${add_attribute("value", $deviceIds, 0)}>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
          }
        })} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-hozalign",
            label: "Horizontal Alignment"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<select id="control-hozalign" name="horizontalAlign"${add_attribute("class", inputClassName, 0)}><option value="center" data-svelte-h="svelte-w0t6oy">Center</option><option value="left" data-svelte-h="svelte-aj1gu">Left</option><option value="right" data-svelte-h="svelte-nmgac6">Right</option></select>`;
            }
          }
        )} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-veralign",
            label: "Vertical Alignment"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<select id="control-veralign" name="verticalAlign"${add_attribute("class", inputClassName, 0)}><option value="middle" data-svelte-h="svelte-1w4zyea">Middle</option><option value="top" data-svelte-h="svelte-yxqe5o">Top</option><option value="bottom" data-svelte-h="svelte-64e8dq">Bottom</option></select>`;
            }
          }
        )} ${validate_component(HorizontalField, "HorizontalField").$$render(
          $$result,
          {
            for: "control-resize",
            label: "Resize Mode"
          },
          {},
          {
            default: ({ inputClassName }) => {
              return `<select id="control-resize" name="resize"${add_attribute("class", inputClassName, 0)}><option value="bilinearInterpolation" data-svelte-h="svelte-1lbhtpm">Bilinear</option><option value="bicubicInterpolation" data-svelte-h="svelte-92ntw6">Bicubic</option><option value="hermiteInterpolation" data-svelte-h="svelte-c3b9be">Hermite</option><option value="bezierInterpolation" data-svelte-h="svelte-x6cc64">Bezier</option><option value="nearestNeighbor" data-svelte-h="svelte-1v4z3pw">Nearest Neighbor</option></select>`;
            }
          }
        )} ${validate_component(HorizontalField, "HorizontalField").$$render(
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
        )} ${validate_component(ResetSubmit, "ResetSubmit").$$render($$result, { loading }, {}, {})}`;
      }
    }
  )}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-e657f84f.js.map
