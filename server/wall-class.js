// @ts-check
"use strict";

class Cell {
  /**
   * @param {string} id
   * @param {number} width
   * @param {number} height
   */
  constructor(id, width, height) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
  }

  toJSON() {
    const { id, x, y, width, height } = this;
    return { id, x, y, width, height };
  }
}

class Wall {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.showingPreview = false;
    /** @type {Map<string, Cell>} */
    this.cells = new Map();
  }

  /**
   * Create a new Cell and add it to the Wall.
   * @param {string} id
   * @param {number} width
   * @param {number} height
   */
  createCell(id, width, height) {
    const cell = new Cell(id, width, height);
    this.cells.set(id, cell);
    return cell;
  }

  /**
   * Move the Cell with the given id
   * @param {string} id ID of a Cell in the Wall
   * @param {number} x
   * @param {number} y
   */
  moveCell(id, x, y) {
    const cell = this.cells.get(id);
    cell.x = x;
    cell.y = y;
  }

  /**
   * Remove a Cell from the Wall.
   * @param {string} id
   */
  removeCell(id) {
    this.cells.delete(id);
  }

  [Symbol.iterator]() {
    return this.cells.values();
  }

  toJSON() {
    return Array.from(this);
  }

  fromJSON(json) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    for (const cell of json) {
      this.createCell(cell.id, cell.width, cell.height);
      this.moveCell(cell.id, cell.x, cell.y);
    }
  }
}

/**
 * Creates an instance of the Wall class, which is used to manage the
 * wall dimensions and the devices it holds.
 * @param {SocketIO.Namespace} io Socket namespace for editor clients.
 */
function createWall(io) {
  class EmitterWall extends Wall {
    createCell(id, width, height) {
      const cell = super.createCell(id, width, height);
      io.emit("add-cell", cell.toJSON());
      return cell;
    }

    removeCell(id) {
      super.removeCell(id);
      io.emit("delete-cell", id);
    }
  }

  return new EmitterWall();
}

exports.createWall = createWall;
