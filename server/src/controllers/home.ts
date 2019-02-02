import { Request, Response } from 'express';
import Koa = require('koa');
import serveStatic = require('koa-static');
import { join, posix } from 'path';

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

export function serveModules(app: Koa, folders: string[]) {
    for (const folder of folders) {
        const path = join(__dirname, '../../node_modules', folder);
        app.use(posix.join('/node_modules', folder), serveStatic(path));
    }
}
