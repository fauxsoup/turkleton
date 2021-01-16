import debug from 'debug';
import { generators } from 'openid-client';
import Redis from 'ioredis';

const log = debug('turkleton:server:api:auth:login');

export default function makeLogin(settings, issuer, client) {
    const code_verifier = generators.codeVerifier();
    const redis = new Redis({
        port: settings('redis.port', 6379),
        host: settings('redis.host', '127.0.0.1'),
        password: settings('redis.password', undefined),
        db: settings('redis.db.auth', 0),
    });

    return async function login(ctx, next) {
        if (ctx.query.code) {
            const params = client.callbackParams(ctx.req);
            const tokens = await client.oauthCallback(
                settings('discord.redirect_uri'),
                params,
                { code_verifier }
            );
            const userInfo = await client.userinfo(tokens.access_token);
            const user = { ...userInfo, tokens };

            await ctx.logIn(user);

            ctx.redirect('/');
        } else {
            const code_challenge = generators.codeChallenge(code_verifier);
            ctx.redirect(client.authorizationUrl({
                scope: 'identify',
                redirect_uri: settings('discord.redirect_uri'),
                code_challenge,
                code_challenge_method: 'S256'
            }));
        }
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
}
