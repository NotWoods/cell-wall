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
const blankState = Object.freeze({ type: "BLANK", payload: "" });
function buildCellState(options) {
  const { type, properties = {}, required = [] } = options;
  return {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: [type]
      },
      ...properties
    },
    required: ["type", ...required]
  };
}
const cellStateBlankSchema = buildCellState({ type: "BLANK" });
const cellStateWebSchema = buildCellState({
  type: "WEB",
  properties: {
    payload: { type: "string", format: "uri" }
  },
  required: ["payload"]
});
const cellStateTextSchema = buildCellState({
  type: "TEXT",
  properties: {
    payload: { type: "string" },
    backgroundColor: { type: "string" }
  },
  required: ["payload"]
});
const cellStateImageSchema = buildCellState({
  type: "IMAGE",
  properties: {
    payload: { type: "string", format: "uri" },
    scaleType: {
      type: "string",
      enum: ["FIT_CENTER", "FIT_XY", "CENTER_INSIDE"]
    }
  },
  required: ["payload"]
});
const allCellStateSchemas = [
  cellStateBlankSchema,
  cellStateImageSchema,
  cellStateTextSchema,
  cellStateWebSchema
];
function getTypeFromSchema(schema) {
  return schema.properties.type.enum[0];
}
export { allCellStateSchemas as a, blankState as b, cellCanvas as c, getTypeFromSchema as g };
