import Router from 'koa-router';
import Redis from 'ioredis';

import get from './get.js';

export function initialize(settings) {
    const redis = new Redis({
        port: settings('redis.port', 6379),
        host: settings('redis.host', '127.0.0.1'),
        password: settings('redis.password', undefined),
        db: settings('redis.db.forms', 0),
    });

    const router = new Router();
    router.get('/', get(settings, redis));
    return router.routes();
}
