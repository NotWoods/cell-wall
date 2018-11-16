import { Socket } from "socket.io";
import { isUUID } from "validator";
import { wall } from "../models/Wall";
import { UUID } from "../models/Cell";

const listeners = new Set<(items: Set<UUID>) => void>();
wall.connectedCells.onchange = items =>
  listeners.forEach(listener => listener(items));

/**
 * Return elements of set a that are not in set b.
 */
function difference<T>(a: Set<T>, b: Set<T>): T[] {
  return [...a].filter(x => !b.has(x));
}

export const connectEditor = (socket: Socket) => {
  console.log("editor connected");

  socket.emit("resize-wall", "width", wall.width);
  socket.emit("resize-wall", "height", wall.height);
  socket.emit("show-preview", wall.showingPreview);

  let connected = new Set<UUID>();
  function onchange(items: Set<UUID>) {
    if (items.size > connected.size) {
      const newCells = difference(items, connected);
      for (const id of newCells) {
        const cell = wall.knownCells.get(id);
        if (cell != null) {
          socket.emit("add-cell", cell);
        }
      }
    } else if (items.size < connected.size) {
      const deletedCells = difference(connected, items);
      for (const id of deletedCells) {
        const cell = wall.knownCells.get(id);
        if (cell != null) {
          socket.emit("delete-cell", cell);
        }
      }
    }

    connected = new Set(items);
  }
  onchange(wall.connectedCells);
  listeners.add(onchange);

  socket.on("move-cell", data => {
    if (
      !isUUID(data.id) ||
      typeof data.x !== "number" ||
      typeof data.y !== "number"
    ) {
      throw new Error(`Bad data: ${JSON.stringify(data)}`);
    }

    const cell = wall.knownCells.get(data.id);
    if (cell != null) {
      cell.position.x = data.x;
      cell.position.y = data.y;
      socket.broadcast.emit("move-cell", data);
    }
  });
  socket.on("resize-wall", (dimension: "width" | "height", value) => {
    if (
      !(dimension === "width" || dimension === "height") ||
      typeof value !== "number"
    ) {
      throw new Error(`Bad data: ${dimension}, ${value}`);
    }

    wall[dimension] = value;
    socket.broadcast.emit("resize-wall", dimension, value);
  });
  socket.on("showing-preview", show => {
    if (typeof show !== "boolean") {
      throw new Error(`Bad data: ${show}`);
    }

    wall.showingPreview = show;
    socket.broadcast.emit("showing-preview", show);
  });

  socket.on("disconnect", () => {
    listeners.delete(onchange);
  });
};
