import { createServer } from 'http';
import Router from 'koa-joi-router';
import Koa from 'koa';

export function makeApp(route: Router.Spec | Router.Spec[]) {
    const router = Router();
    router.route(route);

    const app = new Koa();
    app.use(router.middleware());

    return createServer(app.callback());
}
