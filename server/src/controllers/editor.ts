import { readFile, writeFile } from "fs";
import { promisify } from "util";
import { join } from "path";
import { Socket } from "socket.io";
import { isUUID } from "validator";
import { wall } from "../models/Wall";
import { UUID } from "../models/Cell";

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const CACHE_PATH = join(__dirname, "../../.wall-cache");

const ready = readFileAsync(CACHE_PATH, "utf8")
  .then(JSON.parse)
  .then(json => wall.fromJSON(json))
  .catch(err => {
    if (err.code === "ENOENT") {
      // don't care if cache doesn't exist yet
      return;
    }
    throw err;
  });

async function saveWall() {
  try {
    await writeFileAsync(CACHE_PATH, JSON.stringify(wall), "utf8");
  } catch (err) {
    console.warn("Error while saving cache:", err.message);
  }
}

/**
 * Return elements of set a that are not in set b.
 */
function difference<T>(a: Set<T>, b: Set<T>): T[] {
  return [...a].filter(x => !b.has(x));
}

export const connectEditor = async (socket: Socket) => {
  await ready;
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
    saveWall();
  }
  onchange(wall.connectedCells);
  wall.connectedCells.addListener(onchange);

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
      saveWall();
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
    saveWall();
  });
  socket.on("showing-preview", show => {
    if (typeof show !== "boolean") {
      throw new Error(`Bad data: ${show}`);
    }

    wall.showingPreview = show;
    socket.broadcast.emit("showing-preview", show);
    saveWall();
  });

  socket.on("disconnect", () => {
    wall.connectedCells.removeListener(onchange);
  });
};
