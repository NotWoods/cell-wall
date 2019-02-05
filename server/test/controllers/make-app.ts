import { createServer } from 'http';
import Router = require('koa-joi-router');
import Koa = require('koa');

export function makeApp(route: Router.Spec | Router.Spec[]) {
    const router = Router();
    router.route(route);

    const app = new Koa();
    app.use(router.middleware());

    return createServer(app.callback());
}
