"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const Router = require("koa-joi-router");
const Koa = require("koa");
function makeApp(route) {
    const router = Router();
    router.route(route);
    const app = new Koa();
    app.use(router.middleware());
    return http_1.createServer(app.callback());
}
exports.makeApp = makeApp;
//# sourceMappingURL=make-app.js.map