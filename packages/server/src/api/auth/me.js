export default function makeMe(settings, issuer, client) {
    return async function me(ctx, next) {
        let {tokens, ...user} = ctx.state.user;
        ctx.status = 200;
        ctx.body = user;
    }
}
