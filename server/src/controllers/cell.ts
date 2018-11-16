import { Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import { isUUID } from "validator";
import { Socket } from "socket.io";
import { wall } from "../models/Wall";
import { Cell } from "../models/Cell";
import { CellState } from "../models/CellState";

/**
 * GET /cell/:uuid
 * Returns the current state of the cell.
 */
export const getState = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const cell = wall.getCell(req.params.uuid);
  if (cell == null) {
    res.sendStatus(404); // ID was incorrect
  } else {
    res.json(cell.state);
  }
};
getState.checks = check("uuid").isUUID();

/**
 * PUT /cell/:uuid
 * Register a new cell with the given data
 */
export const putCell = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { uuid } = req.params;
  const existingCell = wall.getCell(uuid);
  let cell = existingCell;
  if (cell == null) {
    cell = new Cell(uuid);
  }
  cell.deviceName = req.body.deviceName;
  cell.display = {
    density: req.body.density,
    heightPixels: req.body.heightPixels,
    widthPixels: req.body.widthPixels
  };
  wall.knownCells.set(uuid, cell);

  console.info(
    `${existingCell != null ? "Updated" : "Added"} cell,`,
    uuid,
    cell
  );

  // Respond with 201 if new cell was created
  res.status(existingCell != null ? 200 : 201).json(cell);
};
putCell.checks = [
  check("uuid").isUUID(),
  check("deviceName").isString(),
  check("density").isNumeric(),
  check("widthPixels").isNumeric(),
  check("heightPixels").isNumeric()
];

export const connectCell = (socket: Socket) => {
  const { uuid } = socket.handshake.query;
  if (!isUUID(uuid)) {
    throw new Error(`Bad cell UUID ${uuid}`);
  }
  console.log("cell connected", uuid);

  function handleUpdate(state: CellState) {
    socket.emit("cell-update", state);
  }

  wall.connectedCells.add(uuid);
  const cell = wall.knownCells.get(uuid);
  if (cell != null) {
    cell.onchange = handleUpdate;
    handleUpdate(cell.state);
  } else {
    throw new Error(`Unknown cell ${uuid}`);
  }

  socket.on("disconnect", () => {
    console.log("cell disconnected");
    delete cell.onchange;
    wall.connectedCells.delete(uuid);
  });
};
