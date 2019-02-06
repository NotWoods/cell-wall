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
import { SocketRouter } from './util/socket-spec';

// Create router
const router = Router();

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
app.use(serveStatic(join(__dirname, '../../web/public'), { maxAge: 36000 }));
app.use(router.middleware());
const server = createServer(app.callback());

// Create SocketIO server
const io = socketIO(server);
const cellRouter = new SocketRouter();
const editorRouter = new SocketRouter();

/**
 * SocketIO configuration
 */
cellRouter.route(cellController.connectCell);
editorRouter.route(editorController.connectEditor);
editorRouter.route(editorController.editorMoveCell);
editorRouter.route(editorController.editorResizeWall);
editorRouter.route(editorController.editorShowPreview);

io.of('/cell').on('connection', cellRouter.onConnect());
io.of('/edit').on('connection', editorRouter.onConnect);

export default server;
