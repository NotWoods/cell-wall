import { c as create_ssr_component, h as compute_rest_props, j as spread, k as escape_object, a as subscribe, v as validate_component, e as escape, b as add_attribute } from "../../../chunks/index-4d214b4e.js";
import { R as ResetSubmit } from "../../../chunks/ResetSubmit-ef1937a5.js";
import { D as DeviceOptions } from "../../../chunks/DeviceOptions-8dcbbe6c.js";
import { H as HorizontalField } from "../../../chunks/HorizontalField-12292c4d.js";
import { F as Form } from "../../../chunks/SubmitButton-113a8403.js";
import { a as getRemoteContext, s as storeEntries, b as storeKeys } from "../../../chunks/__layout-3ca1fd0f.js";
import "../../../chunks/LoadingSpinner-97b51d95.js";
import "../../../chunks/snackbar-host-6f301a82.js";
import "../../../chunks/cell-state-schema-de0c81a8.js";
import "../../../chunks/index-23b4b723.js";
import "../../../chunks/TopBar-fb618005.js";
const FileInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<label class="${"file-label relative w-full shadow-sm rounded-md flex-1 bg-white border border-gray-300"}"><input${spread([
    escape_object($$restProps),
    {
      class: "file-input absolute inset-0 rounded-md w-full cursor-pointer"
    },
    { type: "file" }
  ], {})}>
	<div class="${"relative flex pointer-events-none cursor-pointer"}"><span class="${"inline-flex items-center px-3 rounded-l-md border-r border-gray-300 bg-gray-50 text-gray-500 text-sm "}" aria-hidden="${"true"}"><svg class="${"fill-current mr-1"}" width="${"24"}" height="${"24"}" viewBox="${"4 3 18 17"}"><path d="${"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"}"></path></svg>
			Choose a file\u2026
		</span>
		<span class="${"flex-1 block bg-white w-full rounded-none rounded-r-md sm:text-sm border-gray-300 px-3 py-2"}" aria-hidden="${"true"}">${slots.default ? slots.default({}) : ``}</span></div></label>`;
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
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  return `${validate_component(Form, "Form").$$render($$result, {
    class: "flex flex-col gap-y-4",
    action: "/api/action/image/",
    onSubmit: submit
  }, {}, {
    default: ({ loading }) => {
      return `${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-image", label: "Image" }, {}, {
        default: () => {
          return `${validate_component(FileInput, "FileInput").$$render($$result, {
            required: true,
            accept: "image/*",
            name: "image",
            id: "control-image"
          }, {}, {
            default: () => {
              return `${escape(fileName)}`;
            }
          })}`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, { for: "control-serial", label: "Devices" }, {}, {
        default: ({ inputClassName }) => {
          return `<select multiple name="${"device"}" id="${"control-serial"}"${add_attribute("class", inputClassName, 0)}${add_attribute("value", $deviceIds, 0)}>${validate_component(DeviceOptions, "DeviceOptions").$$render($$result, { devices: $devices }, {}, {})}</select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-hozalign",
        label: "Horizontal Alignment"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<select id="${"control-hozalign"}" name="${"horizontalAlign"}"${add_attribute("class", inputClassName, 0)}><option value="${"center"}">Center</option><option value="${"left"}">Left</option><option value="${"right"}">Right</option></select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-veralign",
        label: "Vertical Alignment"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<select id="${"control-veralign"}" name="${"verticalAlign"}"${add_attribute("class", inputClassName, 0)}><option value="${"middle"}">Middle</option><option value="${"top"}">Top</option><option value="${"bottom"}">Bottom</option></select>`;
        }
      })}

	${validate_component(HorizontalField, "HorizontalField").$$render($$result, {
        for: "control-resize",
        label: "Resize Mode"
      }, {}, {
        default: ({ inputClassName }) => {
          return `<select id="${"control-resize"}" name="${"resize"}"${add_attribute("class", inputClassName, 0)}><option value="${"bilinearInterpolation"}">Bilinear</option><option value="${"bicubicInterpolation"}">Bicubic</option><option value="${"hermiteInterpolation"}">Hermite</option><option value="${"bezierInterpolation"}">Bezier</option><option value="${"nearestNeighbor"}">Nearest Neighbor</option></select>`;
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
export { Image as default };
