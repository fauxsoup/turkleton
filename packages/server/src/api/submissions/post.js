import moment from 'moment';

export default function makeGet(settings, redis) {
    return async function post(ctx, next) {
        const {user} = ctx.state;
        const {form, coach} = ctx.request.body;
        const id = shortid();
        const uploadDate = moment.utc().toISOString();
        const lastModified = uploadDate;

        await redis.set(`forms:${form.id}`, JSON.stringify({
            ...form,
            id,
            uploadDate,
            lastModified
        }));
        await redis.sadd(`users:${coach}:forms`, form.id);
        await redis.sadd(`users:${user.id}:submissions`, form.id);

        ctx.status = 204;
    }
}
