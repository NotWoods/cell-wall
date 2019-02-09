import { Joi, Spec } from 'koa-joi-router';
import { blank, image, text } from '../models/CellState';
import { Wall, wallSchema } from '../models/Wall';
import { enumerate } from '../util/itertools';

function showText(wall: Wall, list: string[]) {
    for (const [i, cell] of enumerate(wall)) {
        if (i < list.length) {
            cell.state = text(list[i]);
        } else {
            cell.state = blank();
        }
    }
}

const actions = Object.freeze({
    demo: {
        name: 'Text/photos demo',
        /**
         * Demo the CellWall by showing "Hello World!" along with
         * some images surrounding it.
         */
        run(wall: Wall) {
            const center = wall.centerCell();
            if (center != null) {
                center.state = text('Hello world!');
            }

            for (const [i, cell] of enumerate(wall.surroundingCells())) {
                cell.state = image(`/img/demo${i % 2}.jpg`);
            }
        },
    },
    /**
     * Show a dashboard with weather, clock, upcoming events.
     * Take ideas from the Google Home displays.
     */
    dashboard: {
        name: 'Dashboard',
        run() {
            // TODO
        },
    },
    todo: {
        name: 'To Do',
        /**
         * Show a todo list, one item per cell.
         */
        run(wall: Wall) {
            const mockTodoList = [
                'Take out the trash',
                'Make more lists',
                'Give Daphne a hug',
                'Build CellWall',
                'Finish that assignment',
                'Pet Roxy',
                "This shouldn't show up",
            ];

            showText(wall, mockTodoList);
        },
    },
    /**
     * Show controls for the smart home.
     */
    home: {
        name: 'Home controls',
        run() {
            // TODO
        },
    },
    /**
     * Play Simon Says
     */
    simon: {
        name: 'Simon says',
        run() {
            // TODO
        },
    },
});

type Action = keyof typeof actions;

/**
 * GET /wall
 * Returns the serialized version of the wall.
 */
export function getWall(wall: Wall): Spec {
    return {
        method: 'GET',
        path: '/wall',
        validate: {
            output: {
                200: { body: wallSchema },
            },
        },
        async handler(ctx) {
            ctx.body = wall.toJSON();
        },
    };
}

/**
 * GET /wall/actions
 * Return list of actions that can be manually triggered.
 */
export const getActions: Spec = {
    method: 'GET',
    path: '/wall/actions',
    validate: {
        output: {
            200: {
                body: Joi.array().items(
                    Joi.object({
                        id: Joi.only(Object.keys(actions)),
                        name: Joi.string(),
                    }),
                ),
            },
        },
    },
    async handler(ctx) {
        ctx.body = Object.entries(actions).map(([id, details]) => ({
            id,
            name: details.name,
        }));
    },
};

/**
 * POST /wall/action/text
 * Display a list of text on the wall
 */
export function postTextAction(wall: Wall): Spec {
    return {
        method: 'POST',
        path: '/wall/action/text',
        validate: {
            body: Joi.array().items(Joi.string()),
            type: 'json',
        },
        async handler(ctx) {
            const list = ctx.request.body as string[];
            await showText(wall, list);

            ctx.redirect('/');
        },
    };
}

/**
 * POST /wall/action/:person
 * Display a greeting to a person, along with images of them.
 */
export function postPersonAction(wall: Wall): Spec {
    return {
        method: 'POST',
        path: '/wall/action/:person',
        validate: {
            params: {
                person: Joi.string(),
            },
        },
        async handler(ctx) {
            const person = ctx.params.person as string;

            const center = wall.centerCell();
            if (center != null) {
                center.state = text(`Welcome ${person}!`);
            }

            for (const [i, cell] of enumerate(wall.surroundingCells())) {
                cell.state = image(`/img/demo${i % 2}.jpg`);
            }

            ctx.redirect('/');
        },
    };
}

/**
 * POST /wall/action/:action
 * Returns the serialized version of the wall.
 */
export function postAction(wall: Wall): Spec {
    return {
        method: 'POST',
        path: '/wall/action/:action',
        validate: {
            params: {
                action: Joi.only(Object.keys(actions)),
            },
        },
        async handler(ctx) {
            const action = ctx.params.action as Action;
            await actions[action].run(wall);

            ctx.redirect('/');
        },
    };
}
