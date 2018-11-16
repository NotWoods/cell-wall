// @ts-check
"use strict";

const socket = io(new URL("../edit", location.href).href);
const board = new Board();

/**
 * @typedef {object} CellInfo
 * @prop {string} id
 * @prop {number} x
 * @prop {number} y
 * @prop {number} width
 * @prop {number} height
 */

socket.on("connect", () => {
  document.body.classList.add("connected");
});
socket.on("disconnect", () => {
  document.body.classList.remove("connected");
});
socket.on("add-cell", cell => {
  /** @type {CellInfo} */
  const info = cell;
  const display = new Display(info.id, info.width, info.height);
  board.add(display.element);
  display.setPosition(info.x, info.y);
});
socket.on("delete-cell", id => {
  const display = Display.get(id);
  if (display) display.destroy();
});
socket.on("move-cell", ({ id, x, y }) => {
  const display = Display.get(id);
  display.setPosition(x, y);
});
socket.on("show-preview", show => board.showPreview(show));
socket.on("resize-wall", (dimension, value) => {
  board.setDimension(dimension, value);
  board.updateScale();
});

board.element.addEventListener("move", event => {
  const display = Display.get(event.target);
  socket.emit("move-cell", display.toJSON());
});
form.addEventListener("change", event => {
  const input =
    /** @type {HTMLInputElement|HTMLSelectElement} */ (event.target);
  switch (input.name) {
    // Adjust width and height of the CellWall board
    case "width":
    case "height":
      const value = parseInt(input.value, 10);
      board.setDimension(input.name, value);
      board.updateScale();
      socket.emit("resize-wall", input.name, value);
      break;
    case "preview":
      const { checked } = /** @type {HTMLInputElement} */ (input);
      board.showPreview(checked);
      socket.emit("show-preview", checked);
      break;
  }
});
window.addEventListener("resize", () => {
  board.updateContainerDimensions();
  board.updateScale();
});
