import got from 'got';

export default function api(user) {
    const {tokens} = user;

    return got.extend({
        prefixUrl: 'https://discord.com/api',
        headers: {
            'Authorization': `Bearer ${tokens.access_token}`
        }
    })
}
