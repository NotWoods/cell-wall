import { createCell, Cell, CellState } from "./cell-struct";

class Wall {
  width = 0;
  height = 0;
  showingPreview = false;
  cells = new Map<string, Cell>();

  /**
   * Create a new Cell and add it to the Wall.
   * @param {string} id
   * @param {number} width
   * @param {number} height
   */
  createCell(id: string, width: number, height: number) {
    const cell = createCell(id, width, height);
    this.cells.set(id, cell);
    return cell;
  }

  /**
   * Move the Cell with the given id
   * @param {string} id ID of a Cell in the Wall
   * @param {number} x
   * @param {number} y
   */
  moveCell(id: string, x: number, y: number) {
    const cell = this.cells.get(id);
    if (cell) {
      cell.x = x;
      cell.y = y;
    }
  }

  /**
   * Remove a Cell from the Wall.
   * @param {string} id
   */
  removeCell(id: string) {
    this.cells.delete(id);
  }

  /**
   * Set the state of a cell
   * @param id
   * @param state
   */
  updateState(id: string, state: CellState) {
    const cell = this.cells.get(id);
    if (cell) cell.state = state;
  }

  [Symbol.iterator]() {
    return this.cells.values();
  }

  toJSON() {
    return Array.from(this);
  }

  fromJSON(json: string | Cell[]) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    for (const cell of json as Cell[]) {
      this.createCell(cell.id, cell.width, cell.height);
      this.moveCell(cell.id, cell.x, cell.y);
    }
  }
}

/**
 * Creates an instance of the Wall class, which is used to manage the
 * wall dimensions and the devices it holds.
 * @param {SocketIO.Namespace} editorIo Socket namespace for editor clients.
 * @param {SocketIO.Namespace} cellIo Socket namespace for cell display clients.
 */
export function createWall(
  editorIo: SocketIO.Namespace,
  cellIo: SocketIO.Namespace
) {
  class EmitterWall extends Wall {
    createCell(id: string, width: number, height: number) {
      const cell = super.createCell(id, width, height);
      editorIo.emit("add-cell", cell);
      return cell;
    }

    removeCell(id: string) {
      super.removeCell(id);
      editorIo.emit("delete-cell", id);
    }

    /**
     * @param id
     * @param state
     */
    updateState(id: string, state: CellState) {
      super.updateState(id, state);
      cellIo.to(id).emit("cell-update", state.mode);
    }
  }

  return new EmitterWall();
}
