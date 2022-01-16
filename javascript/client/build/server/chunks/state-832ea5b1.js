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
    url: { type: "string", format: "uri" }
  },
  required: ["url"]
});
const cellStateTextSchema = buildCellState({
  type: "TEXT",
  properties: {
    text: { type: "string" },
    backgroundColor: { type: "string" }
  },
  required: ["text"]
});
const cellStateImageSchema = buildCellState({
  type: "IMAGE",
  properties: {
    src: { type: "string", format: "uri" },
    scaleType: {
      type: "string",
      enum: ["FIT_CENTER", "FIT_XY", "CENTER_INSIDE"]
    }
  },
  required: ["src"]
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
var CellStateType;
(function(CellStateType2) {
  CellStateType2["BLANK"] = "BLANK";
  CellStateType2["CONFIGURE"] = "CONFIGURE";
  CellStateType2["TEXT"] = "TEXT";
  CellStateType2["IMAGE"] = "IMAGE";
  CellStateType2["BUTTON"] = "BUTTON";
  CellStateType2["WEB"] = "WEB";
})(CellStateType || (CellStateType = {}));
export { allCellStateSchemas as a, getTypeFromSchema as g };
