import { join } from "path";
import { Request, Response, Express, static as serveStatic } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
  res.sendStatus(200);
};

/**
 * GET /is-cellwall-server
 * Indicates this server is a CellWall server
 */
export const isCellWall = (req: Request, res: Response) => {
  res.sendStatus(204);
};

export function serveModules(app: Express, folders: string[]) {
  for (const folder of folders) {
    app.use(
      join("/node_modules", folder),
      serveStatic(join(__dirname, "../node_modules", folder))
    );
  }
}
