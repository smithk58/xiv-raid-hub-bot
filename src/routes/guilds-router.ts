/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Context, DefaultState, ParameterizedContext } from 'koa';
import * as Router from '@koa/router';
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
guildsRouter.get('/', (ctx: RContext) => {
    const guilds = discordClientAPIService.getGuilds();
    ctx.ok(guilds);
});
guildsRouter.get('/:id', (ctx: RContext) => {
    const guildId = ctx.params.id;
    const guild = discordClientAPIService.getGuild(guildId);
    if (guild) {
        ctx.ok(guild);
    } else {
        ctx.notFound('Guild not found. The bot may have been removed from selected server, or discord is having issues.');
    }
});
guildsRouter.get('/:id/channels', (ctx: RContext) => {
    const guildId = ctx.params.id;
    const channels = discordClientAPIService.getGuildTextChannels(guildId);
    if (channels) {
        ctx.ok(channels);
    } else {
        ctx.notFound('Guild not found. The bot may have been removed from selected server, or discord is having issues.');
    }
});
guildsRouter.get('/:id/roles', (ctx: RContext) => {
    const guildId = ctx.params.id;
    const channels = discordClientAPIService.getGuildRoles(guildId);
    if (channels) {
        ctx.ok(channels);
    } else {
        ctx.notFound('Guild not found. The bot may have been removed from selected server, or discord is having issues.');
    }
});
export default guildsRouter.routes();
