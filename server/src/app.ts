import { createServer } from 'http';
import { join } from 'path';
import Koa = require('koa');
import bodyParser = require('koa-bodyparser');
import serveStatic = require('koa-static');
import socketIO = require('socket.io');
// import passport = require('passport');
// import './auth';

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as cellController from './controllers/cell';
import * as editorController from './controllers/editor';
import * as wallController from './controllers/wall';

// Create server
const app = new Koa();

// Create SocketIO server
const server = createServer(app.callback());
const io = socketIO(server);

// Express configuration
export const port = process.env.PORT || 3000;
export const env = process.env.NODE_ENV;
app.use(bodyParser());

app.use(serveStatic(join(__dirname, '../public'), { maxage: 36000 }));
homeController.serveModules(app, ['interactjs/dist', 'socket.io-client/dist']);

// SocketIO configuration
const cell = io.of('/cell');
const edit = io.of('/edit');

// Error handling middleware
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/is-cellwall-server', homeController.isCellWall);
app.get('/wall', wallController.getWall);
app.get('/wall/actions', wallController.getActions);
app.post('/wall/action/text', wallController.postTextAction);
app.post(
    '/wall/action/person',
    wallController.postPersonAction.checks,
    wallController.postPersonAction,
);
app.post('/wall/action/:action', wallController.postAction);
app.get('/cell/:uuid', cellController.getState.checks, cellController.getState);
app.put('/cell/:uuid', cellController.putCell.checks, cellController.putCell);

// Star the OAuth login process for Google.
/*app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/photoslibrary.readonly',
            'profile',
        ],
        failureFlash: true, // Display errors to the user.
        session: true,
    }),
);

// Callback receiver for the OAuth process after log in.
app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        failureFlash: true,
        session: true,
    }),
    (req, res) => {
        // User has logged in.
        console.info('User has logged in.');
        res.redirect('/');
    },
);*/

cell.on('connection', cellController.connectCell);
edit.on('connection', editorController.connectEditor);

export default server;
