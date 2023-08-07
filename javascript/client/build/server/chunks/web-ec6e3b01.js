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
    properties: {
      type: {
        type: "string",
        const: type
      },
      ...properties
    },
    required: ["type", ...required]
  };
}
const blankState = Object.freeze({ type: "BLANK", payload: "" });
const cellStateBlankSchema = buildSchema({ type: "BLANK" });
const cellStateBusySchema = buildSchema({
  type: "BUSY",
  properties: {
    payload: {
      type: "string",
      title: "Calendar ID",
      examples: ["tigeroakes@gmail.com", "daphne.liu97@gmail.com"]
    }
  },
  required: ["payload"]
});
const cellStateClockSchema = buildSchema({
  type: "CLOCK",
  properties: {
    payload: { type: "string", title: "Time Zone" }
  }
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

export { cellStateBlankSchema as a, blankState as b, cellCanvas as c, cellStateClockSchema as d, cellStateBusySchema as e, cellStateImageSchema as f, cellStateTextSchema as g, cellStateWebSchema as h };
//# sourceMappingURL=web-ec6e3b01.js.map
