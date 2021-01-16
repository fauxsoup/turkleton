import App from 'koa';
import mount from 'koa-mount';
import * as auth from './auth/index.js';
import * as coach from './coach/index.js';
import * as forms from './forms/index.js';
import * as submissions from './submissions/index.js';

export function initialize(settings) {
    const app = new App();
    app.use(auth.authenticator(settings));
    app.use(mount('/auth', auth.initialize(settings)));
    app.use(mount('/coach', coach.initialize(settings)));
    app.use(mount('/forms', forms.initialize(settings)));
    app.use(mount('/submissions', submissions.initialize(settings)));
    return app;
}
