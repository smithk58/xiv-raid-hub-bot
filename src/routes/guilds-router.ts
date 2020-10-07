import { Context, DefaultState, ParameterizedContext } from 'koa';
import * as Router from '@koa/router';
import { RaidHubService } from '../services/raid-hub-service';
import { Container } from 'typescript-ioc';
import { APIKeyService } from '../services/APIKeyService';
import { DiscordClientApiService } from '../services/discord-client-api';

export type RContext = ParameterizedContext<DefaultState, Context & Router.RouterParamContext<DefaultState, Context>>;

const discordClientAPIService: DiscordClientApiService = Container.get(DiscordClientApiService);
const apiKeyService: APIKeyService = Container.get(APIKeyService);

const routerOpts: Router.RouterOptions = {prefix: '/guilds'};
const guildsRouter: Router = new Router<DefaultState, Context>(routerOpts);

// Protect these routes
guildsRouter.use(async (ctx: RContext, next) => {
    apiKeyService.errorIfNotValidAPIKey(ctx);
    return next();
});
guildsRouter.get('/', async (ctx: RContext) => {
    const guilds = discordClientAPIService.getGuilds();
    ctx.ok(guilds);
});
guildsRouter.get('/:id/channels', async (ctx: RContext) => {
    const guildId = ctx.params.id;
    const channels = discordClientAPIService.getGuildTextChannels(guildId);
    if (channels) {
        ctx.ok(channels);
    } else {
        ctx.notFound('Guild not found. The bot may have been removed from selected server, or discord is having issues.');
    }
});
export default guildsRouter.routes();
