export default function makePost(settings, redis) {
    return async function post(ctx, next) {
        const { user } = ctx.state;
        const payload = ctx.request.body;

        const existing = await redis.get(`coach:${user.id}`);
        if (existing) {
            ctx.status = 409;
        } else {
            if (isValid(payload)) {
                const json = JSON.stringify(payload);
                await redis.set(`coach:${user.id}`, json);
                ctx.status = 204;
            } else {
                ctx.status = 400;
            }
        }
    }
}
