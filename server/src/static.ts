import { static as serveStatic, Express } from "express";
import { join } from "path";

export function serveModules(app: Express, folders: string[]) {
  for (const folder of folders) {
    app.use(
      join("/node_modules", folder),
      serveStatic(join(__dirname, "../node_modules", folder))
    );
  }
}
