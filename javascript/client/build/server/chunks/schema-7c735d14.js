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
export { allCellStateSchemas as a, blankState as b, getTypeFromSchema as g };
