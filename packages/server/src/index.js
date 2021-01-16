import debug from 'debug';
import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import logger from 'koa-logger';
import Router from 'koa-router';
import { createRequire } from 'module';
import * as path from 'path';

import * as api from './api/index.js';

const log = debug('turkleton:server');
const require = createRequire(import.meta.url);

export function start(port, settings) {
    log('start()')
    const app = new Koa();
    const router = new Router();

    app.keys = settings('secrets.session_keys');

    const clientPath = path.resolve(
        path.dirname(require.resolve('@turkleton/client')),
        '..'
    );
    app.use(logger());
    app.use(bodyParser());
    app.use(session({}, app));
    app.use(serve(clientPath));
    app.use(mount('/api', api.initialize(settings)));
    app.use(async (ctx) => {
        if (ctx.status === 404 && !ctx.path.startsWith('/api'))
            await send(ctx, 'index.html', { root: clientPath });
    });
    app.listen(port);
}
