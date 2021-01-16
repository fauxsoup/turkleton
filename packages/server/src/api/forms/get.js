export default function makeGet(settings, redis) {
    return async function get(ctx, next) {
        const {user} = ctx.state;
        const formIds = await redis.smembers(`users:${user.id}:forms`);
        const forms = [];

        for (let id of formIds) {
            const formJSON = await redis.get(`forms:${id}`);
            const form = JSON.parse(formJSON);

            forms.push(form);
        }

        ctx.status = 200;
        ctx.body = forms;
    }
}
