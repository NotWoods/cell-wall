import './web-ec6e3b01.js';

function isNumber(number) {
  return typeof number === "number" && !Number.isNaN(number);
}
function validRect(rect = {}) {
  return isNumber(rect.width) && isNumber(rect.height);
}
function validRectWithPos(rect = {}) {
  return isNumber(rect.x) && isNumber(rect.y) && validRect(rect);
}
function splitToBuckets(devices) {
  const rectWithPos = [];
  const rect = [];
  const rest = [];
  for (const [serial, { info }] of devices) {
    if (!info) {
      rest.push({ serial });
      continue;
    }
    if (validRectWithPos(info)) {
      rectWithPos.push(info);
    } else if (validRect(info)) {
      rect.push(info);
    } else {
      rest.push(info);
    }
  }
  return { rectWithPos, rect, rest };
}
function fitScale(container, canvas) {
  const { width, height } = canvas;
  const widthScale = container.width / width;
  const heightScale = container.height / height;
  return Math.min(widthScale, heightScale);
}
function applyScale(rect, scale) {
  const { x, y, width, height } = rect;
  return {
    x: x * scale,
    y: y * scale,
    width: width * scale,
    height: height * scale
  };
}

export { applyScale as a, fitScale as f, splitToBuckets as s };
//# sourceMappingURL=fit-scale-333a67b3.js.map
