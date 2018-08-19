import { Socket, Server } from "socket.io";
import { CellMode, CellState } from "./cell-struct";
import { Wall } from "./wall-class";

interface CellSocket extends Socket {
  emit(event: "cell-update", mode: CellMode, data: CellState["data"]): boolean;

  on(
    event: "touch",
    listener: (x: number, y: number, action: string) => void
  ): this;
  on(event: "disconnect", listener: () => void): this;
}

interface EditorSocket extends Socket {
  emit(
    event: "resize-wall",
    dimension: "width" | "height",
    value: number
  ): boolean;
  emit(event: "show-preview", value: boolean): boolean;
  emit(event: "add-cell", cell: { id: string; x: number; y: number }): boolean;
  emit(event: "move-cell", cell: { id: string; x: number; y: number }): boolean;

  on(
    event: "resize-wall",
    listener: (dimension: "width" | "height", value: number) => void
  ): this;
  on(event: "show-preview", listener: (value: boolean) => void): this;
  on(
    event: "move-cell",
    listener: (cell: { id: string; x: number; y: number }) => void
  ): this;

  broadcast: EditorSocket;
}

export function createSocketsAndWall(io: Server) {
  const cell = io.of("/cell");
  const editor = io.of("/edit");

  const wall = new Wall().on("cell-update", (id, state) =>
    cell.to(id).emit("cell-update", state.mode, state.data)
  );

  editor.on("connection", (socket: EditorSocket) => {
    console.log("editor connected");

    // Emit initial values
    socket.emit("resize-wall", "width", wall.width);
    socket.emit("resize-wall", "height", wall.height);
    socket.emit("show-preview", wall.showingPreview);
    for (const cell of wall) {
      socket.emit("add-cell", cell);
    }

    // Add listeners
    socket.on("move-cell", data => {
      wall.moveCell(data.id, data.x, data.y);
      socket.broadcast.emit("move-cell", data);
    });
    socket.on("resize-wall", (dimension, value) => {
      wall[dimension] = value;
      socket.broadcast.emit("resize-wall", dimension, value);
    });
    socket.on("show-preview", show => {
      wall.showingPreview = show;
      socket.broadcast.emit("show-preview", show);
    });
  });

  cell.on("connection", (socket: CellSocket) => {
    console.log("cell connected");
    const { query } = socket.handshake;
    const width = parseInt(query.width, 10) || 0;
    const height = parseInt(query.height, 10) || 0;
    const cell = wall.createCell(socket.id, width, height);
    editor.emit("add-cell", cell);

    socket.emit("cell-update", cell.state.mode, cell.state.data);

    socket.on("disconnect", () => {
      wall.removeCell(socket.id);
      editor.emit("delete-cell", socket.id);
    });
  });

  return { wall, cell, editor };
}
