// @ts-check
"use strict";

const form = /** @type {HTMLFormElement} */ (document.getElementById(
  "options"
));
const displaySelect = /** @type {HTMLSelectElement} */ (form.elements.namedItem(
  "display"
));
const xInput = /** @type {HTMLInputElement} */ (form.elements.namedItem("x"));
const yInput = /** @type {HTMLInputElement} */ (form.elements.namedItem("y"));

/** @type {interact.DraggableOptions} */
const DRAGGABLE_OPTIONS = {
  inertia: true,
  restrict: {
    restriction: "parent",
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  autoScroll: true
};

class Board {
  constructor() {
    this.element = document.getElementById("cellwall-board");
    this.container = this.element.parentElement;
    this.updateContainerDimensions();
    this.setDimension("width", form.width.value);
    this.setDimension("height", form.height.value);
    this.updateScale();
  }

  updateContainerDimensions() {
    this.containerDim = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
  }

  updateScale() {
    const width = parseInt(this.element.style.width, 10);
    const height = parseInt(this.element.style.height, 10);
    if (width > this.containerDim.width || height > this.containerDim.height) {
      const xScale = this.containerDim.width / width;
      const yScale = this.containerDim.height / height;
      console.log(xScale, yScale);
      this.element.style.transform = `scale(${Math.min(xScale, yScale)})`;
    } else {
      this.element.style.transform = "scale(1)";
    }
  }

  /**
   * @param {HTMLElement} element
   */
  add(element) {
    this.element.appendChild(element);
  }

  /**
   * Change the width or height of the board
   * @param {'width' | 'height'} dim
   * @param {number} value
   */
  setDimension(dim, value) {
    this.element.style[dim] = `${value}px`;
  }

  /**
   * Toggles a background image on the board
   * @param {boolean} value
   */
  showPreview(value) {
    if (value) {
      this.element.classList.add("preview");
    } else {
      this.element.classList.remove("preview");
    }
  }
}

/**
 * Displays correspond to a screen on the CellWall. This class holds a UI
 * representation of a display, where the element size and position correspond
 * to the actual display.
 */
class Display {
  constructor(id, width = 32, height = 32) {
    const displayElement = document.createElement("button");
    displayElement.className = "display";
    displayElement.id = id;
    displayElement.style.width = `${width}px`;
    displayElement.style.height = `${height}px`;

    const option = document.createElement("option");
    option.value = id;
    option.textContent = id;

    displaySelect.appendChild(option);

    interact(displayElement)
      .draggable(DRAGGABLE_OPTIONS)
      .on("dragmove", Display.onDragMove)
      .on("dragstart", Display.onDragStart)
      .on("dragend", Display.onDragEnd);

    this.element = displayElement;
    Display.lookup.set(displayElement, this);
  }

  /**
   * Returns the Display instance for the given element.
   * @param {HTMLElement | EventTarget | string} element HTML element or ID string.
   */
  static get(element) {
    if (typeof element === "string") {
      element = document.getElementById(element);
    }

    if (element instanceof HTMLElement) {
      return Display.lookup.get(element) || null;
    } else {
      return null;
    }
  }

  /**
   * Listener called when the display is dragged. Updates the
   * display so its position on screen reflects the x and y valyes set.
   * @param {interact.InteractEvent} event
   */
  static onDragMove(event) {
    const display = Display.get(event.target);

    const { x, y } = display.getPosition();
    display.setPosition(x + event.dx, y + event.dy);
  }

  /**
   * Listener called when the display is clicked on. Adds the selected class
   * and updates the select element with this display's ID.
   * @param {interact.InteractEvent} event
   */
  static onDragStart(event) {
    const display = Display.get(event.target);
    displaySelect.value = display.element.id;
    Display.select(display);
    display.element.classList.add("dragging");
  }

  static onDragEnd(event) {
    const display = Display.get(event.target);
    display.dispatchMoveEvent();
    display.element.classList.remove("dragging");
  }

  /**
   * Adds the `.selected` class to a display. Only 1 display can be selected,
   * so the class is removed from the last selected display.
   * @param {Display | null} display
   */
  static select(display) {
    if (Display.selected != null) {
      Display.selected.element.classList.remove("selected");
    }
    if (display != null) {
      display.element.classList.add("selected");
    }
    Display.selected = display;
  }

  /**
   * Returns the X and Y position of the display.
   */
  getPosition() {
    const x = parseInt(this.element.dataset.x, 10) || 0;
    const y = parseInt(this.element.dataset.y, 10) || 0;
    return { x, y };
  }

  /**
   * Sets the X and Y position of the display.
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    const xs = x.toFixed(0);
    const ys = y.toFixed(0);

    this.element.dataset.x = xs;
    this.element.dataset.y = ys;
    this.element.style.transform = `translate(${xs}px, ${ys}px)`;

    xInput.value = xs;
    yInput.value = ys;
  }

  dispatchMoveEvent() {
    this.element.dispatchEvent(new CustomEvent("move", { bubbles: true }));
  }

  destroy() {
    // Remove <option> from select
    const option = displaySelect.querySelector(
      `option[value=${this.element.id}]`
    );
    option.remove();

    // Remove interact.js listeners
    // @ts-ignore
    interact(this.element).unset();

    // Destroy element
    this.element.remove();
  }

  toJSON() {
    const { x, y } = this.getPosition();
    return { id: this.element.id, x, y };
  }
}
/**
 * @type {WeakMap<HTMLElement, Display>}
 * Used to get the Display instance corresponding to an element
 */
Display.lookup = new WeakMap();
/** @type {Display | null} Display that currently has the `.selected` class */
Display.selected = null;

// When an input in the form is changed, update the UI accordingly
form.addEventListener("change", event => {
  const input =
    /** @type {HTMLInputElement|HTMLSelectElement} */ (event.target);
  switch (input.name) {
    // Change the selected display
    case "display":
      Display.select(Display.get(displaySelect.value));
      break;
    // Change the X and Y of the selected display
    case "x":
    case "y":
      if (Display.selected != null) {
        const pos = Display.selected.getPosition();
        pos[input.name] = parseFloat(input.value);
        Display.selected.setPosition(pos.x, pos.y);
        Display.selected.dispatchMoveEvent();
      }
      break;
  }
});
