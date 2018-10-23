import { Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import { wall, actions, Action } from "../models/Wall";

/**
 * GET /wall
 * Returns the serialized version of the wall.
 */
export const getWall = (req: Request, res: Response) => {
  res.json(wall.toJSON());
};

/**
 * GET /wall/actions
 * Returns the serialized version of the wall.
 */
export const getActions = (req: Request, res: Response) => {
  res.json(actions);
};

/**
 * POST /wall/action
 * Returns the serialized version of the wall.
 */
export const postAction = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const actionFunc = wall[req.body.action as Action];
    await actionFunc();

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ errors: [err] });
  }
};
postAction.checks = check("action").isIn(Object.keys(actions));
