import * as Router from '@koa/router';

import GuildsRouter from './guilds-router';

const apiRouter = new Router({prefix: '/api'});
apiRouter.use(GuildsRouter);
export default apiRouter;
