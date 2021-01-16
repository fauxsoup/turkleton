import debug from 'debug';
import { Issuer, Strategy } from 'openid-client';
import Router from 'koa-router';
import Redis from 'ioredis';
import util from '@amdglobal/util';
import moment from 'moment';

import login from './login.js';
import logout from './logout.js';
import me from './me.js';

const log = debug('turkleton:server:api:auth');

export function authenticator(settings) {
    const redis = new Redis({
        port: settings('redis.port', 6379),
        host: settings('redis.host', '127.0.0.1'),
        password: settings('redis.password', undefined),
        db: settings('redis.db.auth', 0),
    });

    return async function authenticate(ctx, next) {
        let loggedIn = false;

        if (ctx.session.user) {
            try {
                const user = await loadUser(ctx.session.user);
                if (isValid(user)) {
                    ctx.state.user = user;
                    loggedIn = true;
                }
            } catch (err) {
                log('loadUser(%o) : error : %o', ctx.session.user, err);
            }
        }

        ctx.loggedIn = loggedIn;
        ctx.logIn = logIn.bind(null, ctx);
        ctx.logOut = logOut.bind(null, ctx);

        try {
            await next();
        } finally {
            if (ctx.state.user)
                ctx.session.user = await saveUser(ctx.state.user)
        }

    }

    async function logIn(ctx, user) {
        ctx.state.user = user;
        await redis.expire(`users:${user.id}`, 14 * 24 * 60 * 60);
    }

    async function logOut(ctx) {
        await redis.del(`users:${ctx.state.user.id}`);
        ctx.state.user = null;
    }

    async function saveUser(user) {
        let tokens = await util.encodeTokens(user.tokens);
        await redis.set(`users:${user.id}`, JSON.stringify({ ...user, tokens }));
        return user.id;
    }

    async function loadUser(id) {
        let userJSON = await redis.get(`users:${id}`);
        let user = JSON.parse(userJSON);
        let tokens = await util.decodeTokens(user.tokens);

        return { ...user, tokens };
    }

    function isValid(user) {
        if (!user) return false;
        else if (!user.tokens) return false;
        else if (isExpired(user.tokens)) return false;
        else return true;
    }

    function isExpired(tokens) {
        if (moment.utc(tokens.expires_at * 1000)
            .isBefore(moment().subtract(5, 'min'))) {
            return true;
        } else {
            return false;
        }
    }
}

export function initialize(settings) {
    const issuer = new Issuer({
        issuer: settings('discord.issuer'),
        authorization_endpoint: settings('discord.authorization_endpoint'),
        token_endpoint: settings('discord.token_endpoint'),
        revocation_endpoint: settings('discord.revocation_endpoint'),
        userinfo_endpoint: settings('discord.userinfo_endpoint')
    });
    const client = new issuer.Client({
        client_id: settings('discord.client_id'),
        client_secret: settings('discord.client_secret'),
        response_types: ['code'],
    });

    const router = new Router();
    router.all('/login', login(settings, issuer, client));
    router.all('/logout', logout(settings, issuer, client));
    router.get('/me', me(settings, issuer, client));
    return router.routes();
}
