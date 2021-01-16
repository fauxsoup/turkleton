export default function makeGet(settings, redis) {
    return async function get(ctx, next) {
        const coachJSON = await redis.get(`coach:${ctx.params.id}`);
        const coach = JSON.parse(coachSettingsJSON);

        ctx.status = 200;
        ctx.body = coach;
    }
}
