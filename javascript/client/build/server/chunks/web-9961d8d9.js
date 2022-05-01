var __defProp = Object.defineProperty;
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
const AXIS_TO_POS = (/* @__PURE__ */ new Map()).set("width", "x").set("height", "y");
function cellCanvas(cells) {
  const canvas = { x: Infinity, y: Infinity, width: 0, height: 0 };
  for (const info of cells) {
    for (const [axis, pos] of AXIS_TO_POS) {
      const value = info[pos] + info[axis];
      if (!Number.isNaN(value)) {
        canvas[pos] = Math.min(canvas[pos], info[pos]);
        canvas[axis] = Math.max(canvas[axis], info[pos] + info[axis]);
      }
    }
  }
  canvas.width = canvas.width - canvas.x;
  canvas.height = canvas.height - canvas.y;
  return canvas;
}
function buildSchema(options) {
  const { type, properties = {}, required = [] } = options;
  return {
    type: "object",
    properties: __spreadValues({
      type: {
        type: "string",
        const: type
      }
    }, properties),
    required: ["type", ...required]
  };
}
const blankState = Object.freeze({ type: "BLANK", payload: "" });
const cellStateBlankSchema = buildSchema({ type: "BLANK" });
const cellStateClockSchema = buildSchema({
  type: "CLOCK",
  properties: {
    payload: { type: "string", title: "Time Zone" }
  },
  required: ["payload"]
});
const cellStateImageSchema = buildSchema({
  type: "IMAGE",
  properties: {
    payload: { type: "string", title: "Source", format: "uri" },
    scaleType: {
      type: "string",
      enum: ["FIT_CENTER", "FIT_XY", "CENTER_INSIDE"]
    }
  },
  required: ["payload"]
});
const cellStateTextSchema = buildSchema({
  type: "TEXT",
  properties: {
    payload: { type: "string", title: "Text" },
    backgroundColor: { type: "string" }
  },
  required: ["payload"]
});
const cellStateWebSchema = buildSchema({
  type: "WEB",
  properties: {
    payload: { type: "string", title: "URL", format: "uri" }
  },
  required: ["payload"]
});
export { cellStateBlankSchema as a, blankState as b, cellCanvas as c, cellStateClockSchema as d, cellStateImageSchema as e, cellStateTextSchema as f, cellStateWebSchema as g };
