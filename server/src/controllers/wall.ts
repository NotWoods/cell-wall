import { Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import { wall } from "../models/Wall";
import { text, image, blank } from "../models/CellState";
import { enumerate } from "../util/itertools";

function showText(list: string[]) {
  for (const [i, cell] of enumerate(wall)) {
    if (i < list.length) {
      cell.state = text(list[i]);
    } else {
      cell.state = blank();
    }
  }
}

const actions = Object.freeze({
  demo: {
    name: "Text/photos demo",
    /**
     * Demo the CellWall by showing "Hello World!" along with
     * some images surrounding it.
     */
    run() {
      const center = wall.centerCell();
      if (center != null) {
        center.state = text("Hello world!");
      }

      for (const [i, cell] of enumerate(wall.surroundingCells())) {
        cell.state = image(`/img/demo${i % 2}.jpg`);
      }
    }
  },
  /**
   * Show a dashboard with weather, clock, upcoming events.
   * Take ideas from the Google Home displays.
   */
  dashboard: {
    name: "Dashboard",
    run() {
      // TODO
    }
  },
  todo: {
    name: "To Do",
    /**
     * Show a todo list, one item per cell.
     */
    run() {
      const mockTodoList = [
        "Take out the trash",
        "Make more lists",
        "Give Daphne a hug",
        "Build CellWall",
        "Finish that assignment",
        "Pet Roxy",
        "This shouldn't show up"
      ];

      showText(mockTodoList);
    }
  },
  /**
   * Show controls for the smart home.
   */
  home: {
    name: "Home controls",
    run() {
      // TODO
    }
  },
  /**
   * Play Simon Says
   */
  simon: {
    name: "Simon says",
    run() {
      // TODO
    }
  }
});

type Action = keyof typeof actions;

/**
 * GET /wall
 * Returns the serialized version of the wall.
 */
export const getWall = (req: Request, res: Response) => {
  res.json(wall.toJSON());
};

/**
 * GET /wall/actions
 * Return list of actions that can be manually triggered.
 */
export const getActions = (req: Request, res: Response) => {
  res.json(
    Object.entries(actions).map(([id, details]) => ({ id, ...details }))
  );
};

/**
 * POST /wall/action/text
 * Display a list of text on the wall
 */
export const postTextAction = async (req: Request, res: Response) => {
  const list = req.body as string[];
  if (!Array.isArray(list)) {
    return res.status(422).json({ errors: ["Body must be string array"] });
  }

  try {
    await showText(list);

    res.redirect("/");
  } catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
};

/**
 * POST /wall/action/person
 * Display a greeting to a person, along with images of them.
 */
export const postPersonAction = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const person = req.params.person as string;

  try {
    const center = wall.centerCell();
    if (center != null) {
      center.state = text(`Welcome ${person}!`);
    }

    for (const [i, cell] of enumerate(wall.surroundingCells())) {
      cell.state = image(`/img/demo${i % 2}.jpg`);
    }

    res.redirect("/");
  } catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
};
postPersonAction.checks = check("person").isString();

/**
 * POST /wall/action/:action
 * Returns the serialized version of the wall.
 */
export const postAction = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const action = req.params.action as Action;
    await actions[action].run();

    res.redirect("/");
  } catch (err) {
    res.status(500).json({ errors: [err.message] });
  }
};
postAction.checks = check("action").isIn(Object.keys(actions));
