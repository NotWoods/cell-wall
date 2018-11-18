import { enumerate } from "../util/itertools";
import { Cell, CellModel, UUID } from "./Cell";
import { blank, image, text } from "./CellState";
import { ObservableSet } from "./ObservableSet";

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends () => void ? K : never
}[keyof T];

export interface WallModel {
  /**
   * Width of the wall
   */
  width: number;
  /**
   * Height of the wall
   */
  height: number;

  /**
   * Cells that have connected to the Wall
   */
  knownCells: Map<UUID, CellModel>;
  /**
   * UUIDs of cells currently connected to the Wall.
   */
  connectedCells: Set<UUID>;
}

export interface WallSerialized {
  width: number;
  height: number;
  knownCells: CellModel[];
}

class Wall implements WallModel {
  width = 0;
  height = 0;
  knownCells = new Map<UUID, Cell>();
  connectedCells = new ObservableSet<UUID>();
  showingPreview = false;

  /**
   * Returns a serializable version of the Wall.
   */
  toJSON(): WallSerialized {
    return {
      width: this.width,
      height: this.height,
      knownCells: Array.from(this.knownCells.values())
    };
  }

  /**
   * Deserializes a JSON representation of the Wall.
   */
  fromJSON(json: WallSerialized): Wall {
    this.width = json.width;
    this.height = json.height;
    for (const cell of json.knownCells) {
      const cellInst = Object.assign(new Cell(cell.id), cell);
      this.knownCells.set(cell.id, cellInst);
    }
    return this;
  }

  /**
   * Iterates through the currently connected cells.
   */
  *[Symbol.iterator]() {
    for (const uuid of this.connectedCells) {
      const cell = this.knownCells.get(uuid);
      if (cell != null) {
        yield cell;
      }
    }
  }

  /**
   * Finds the cell in the center of the screen.
   * Useful for some modes that show main information on one cell,
   * with background images on the other cells.
   */
  centerCell() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    let shortestDistanceSquared = Infinity;
    let closestCell: CellModel | null = null;
    for (const cell of this) {
      const distanceSquared =
        Math.pow(cell.position.x - centerX, 2) +
        Math.pow(cell.position.y - centerY, 2);
      if (distanceSquared < shortestDistanceSquared) {
        shortestDistanceSquared = distanceSquared;
        closestCell = cell;
      }
    }

    return closestCell;
  }

  *surroundingCells() {
    const center = this.centerCell();
    for (const cell of this) {
      if (cell !== center) {
        yield cell;
      }
    }
  }

  getCell(uuid: UUID) {
    return this.knownCells.get(uuid) || null;
  }
}

export const wall = new Wall();
