import * as Koa from 'koa';
import * as Helmet from 'koa-helmet';
import * as Logger from 'koa-logger';
import * as Cors from '@koa/cors';
const respond = require('koa-respond');
import apiRouter from '../routes';

require('dotenv').config();

const app: Koa = new Koa();
// Security
app.use(Helmet());

// Logger and CORS for local dev
if (process.env.NODE_ENV === 'development') {
    app.use(Logger());
    app.use(Cors({credentials: true}));
} else {
    const origin = process.env.ALLOWED_ORIGIN || 'https://api.xivraidhub.com';
    app.use(Cors({origin, credentials: true}));
}

// Easier responses https://www.npmjs.com/package/koa-respond
app.use(respond());

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (error) {
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = error.message || error.toString();
        ctx.app.emit('error', error, ctx);
    }
});
// Routes
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// Application error logging.
app.on('error', console.error);
export default app;
