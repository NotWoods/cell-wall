import { Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import { wall } from "../models/Wall";

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
