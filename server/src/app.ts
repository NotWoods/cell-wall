import { createServer } from 'http';
import { join } from 'path';
import Koa = require('koa');
import Router = require('koa-joi-router');
import serveStatic = require('koa-static');
import socketIO = require('socket.io');

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as cellController from './controllers/cell';
import * as editorController from './controllers/editor';
import * as wallController from './controllers/wall';
import { serveModule } from './resolve';

// Create router
const router = Router();

const staticOpts: serveStatic.Options = { maxAge: 36000 };
router.use(serveStatic(join(__dirname, '../public'), staticOpts));
serveModule(router, 'interactjs/dist', staticOpts);
serveModule(router, 'socket.io-client/dist', staticOpts);

/**
 * Primary app routes.
 */
router.route(homeController.isCellWall);
router.route(wallController.getWall);
router.route(wallController.getActions);
router.route(wallController.postTextAction);
router.route(wallController.postPersonAction);
router.route(wallController.postAction);
router.route(cellController.getState);
router.route(cellController.putCell);

// Create HTTP server
const app = new Koa();
app.use(router.middleware);
const server = createServer(app.callback());

// Create SocketIO server
const io = socketIO(server);

// SocketIO configuration
const cell = io.of('/cell');
const edit = io.of('/edit');

cell.on('connection', cellController.connectCell);
edit.on('connection', editorController.connectEditor);

export default server;
