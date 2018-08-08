// @ts-check
"use strict";

const { Server } = require("http");
const express = require("express");
const SocketIO = require("socket.io");
const { createWall } = require("./wall-class.js");

const app = express();
const http = new Server(app);
const io = SocketIO(http);
const cell = io.of("/cell");
const editor = io.of("/edit");

const wall = createWall(editor);
wall.createCell("red", 32, 40);
wall.createCell("blue", 50, 40);

app.use("/editor", express.static("editor"));
app.use(
  "/node_modules/interactjs/dist",
  express.static("node_modules/interactjs/dist")
);
app.use(
  "/node_modules/socket.io-client/dist",
  express.static("node_modules/socket.io-client/dist")
);

app.get("/is-cellwall-server", (req, res) => {
  res.sendStatus(204);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

editor.on("connection", socket => {
  console.log("editor connected");
  // Emit initial values
  socket.emit("resize-wall", "width", wall.width);
  socket.emit("resize-wall", "height", wall.height);
  socket.emit("show-preview", wall.showingPreview);
  for (const cell of wall) {
    socket.emit("add-cell", cell.toJSON());
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

cell.on("connection", socket => {
  console.log("cell connected");
  const { query } = socket.handshake;
  const width = parseInt(query.width, 10) || 0;
  const height = parseInt(query.height, 10) || 0;
  wall.createCell(socket.id, width, height);

  socket.on("disconnect", () => wall.removeCell(socket.id));
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
