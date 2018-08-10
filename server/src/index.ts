// @ts-check
"use strict";

import { Server } from "http";
import { join } from "path";
import { createWall } from "./wall-class";
import express = require("express");
import SocketIO = require("socket.io");
import { CellMode } from "./cell-struct";

const app = express();
const http = new Server(app);
const io = SocketIO(http);

const cell = io.of("/cell");
const editor = io.of("/edit");

interface CellSocket extends SocketIO.Socket {
  emit(event: "cell-update", mode: CellMode): boolean;
}

interface EditorSocket extends SocketIO.Socket {
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

const wall = createWall(editor, cell);
wall.createCell("red", 32, 40);
wall.createCell("blue", 50, 40);

app.use("/editor", express.static(join(__dirname, "../editor")));
app.use(
  "/node_modules/interactjs/dist",
  express.static(join(__dirname, "../node_modules/interactjs/dist"))
);
app.use(
  "/node_modules/socket.io-client/dist",
  express.static(join(__dirname, "../node_modules/socket.io-client/dist"))
);

app.get("/is-cellwall-server", (req, res) => {
  res.sendStatus(204);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/:id/:mode", (req, res) => {
  const { id, mode } = req.params;
  const cell = wall.cells.get(id);
  if (cell == null) {
    // ID was incorrect or the cell disconnected
    res.sendStatus(401);
  } else if (mode !== cell.state.mode) {
    // Mode did not match the current mode
    res.sendStatus(400);
  } else {
    res.json(cell.state.data);
  }
});

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

  socket.emit("cell-update", cell.state.mode);

  socket.on("disconnect", () => wall.removeCell(socket.id));
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
