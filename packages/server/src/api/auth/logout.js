import debug from 'debug';
const log = debug('turkleton:server:api:auth:logout');
export default function makeLogout(issuer, client) {
    return async function logout(ctx, next) {
        log('ctx.logout()');
        await ctx.logout();
        return next();
    }
}
