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
import { wall } from './models/Wall';

// Create router
const router = Router();

/**
 * Primary app routes.
 */
router.route(homeController.isCellWall);
router.route(wallController.getWall(wall));
router.route(wallController.getActions);
router.route(wallController.postTextAction(wall));
router.route(wallController.postPersonAction(wall));
router.route(wallController.postAction(wall));
router.route(cellController.getState(wall));
router.route(cellController.putCell(wall));

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
cellRouter.route(cellController.connectCell(wall));
editorRouter.route(editorController.connectEditor(wall));
editorRouter.route(editorController.editorMoveCell(wall));
editorRouter.route(editorController.editorResizeWall(wall));
editorRouter.route(editorController.editorShowPreview(wall));

io.of('/cell').on('connection', cellRouter.onConnect());
io.of('/edit').on('connection', editorRouter.onConnect);

export default server;
