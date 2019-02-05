import { Router } from 'koa-joi-router';
import { join, posix } from 'path';
import serveStatic = require('koa-static');

export function serveModule(
    router: Router,
    folder: string,
    opts?: serveStatic.Options,
) {
    const path = join(__dirname, '../../node_modules', folder);
    router.use(posix.join('/node_modules', folder), serveStatic(path, opts));
}
