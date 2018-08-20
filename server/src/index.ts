import { Server } from "http";
import { join } from "path";
import { json } from "body-parser";
import { createSocketsAndWall } from "./sockets";
import { serveModules } from "./static";
import express = require("express");
import SocketIO = require("socket.io");
import { text } from "./cell-struct";

const app = express();
const http = new Server(app);
const io = SocketIO(http);
const { wall } = createSocketsAndWall(io);

app.use(express.static(join(__dirname, "../public")));
app.use(json());
serveModules(app, ["interactjs/dist", "socket.io-client/dist"]);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/is-cellwall-server", (req, res) => {
  res.sendStatus(204);
});

app.get("/data/:mode/:id", (req, res) => {
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

app.post("/run/text", (req, res) => {
  const textItems = req.body as string[];
  let i = 0;
  for (const cell of wall) {
    const textItem = textItems[i] || "";
    wall.updateState(cell.id, text(textItem));
  }

  res.sendStatus(201);
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
