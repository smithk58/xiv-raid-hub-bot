import { Inject, Singleton } from 'typescript-ioc';

import { RContext } from '../routes/guilds-router';
import { EnvService } from './env-service';

@Singleton
export class APIKeyService {
    @Inject private envService: EnvService;
    /**
     * Errors if the context doesn't have a valid API key.
     * @param ctx - The context to search for an API key on.
     */
    public errorIfNotValidAPIKey(ctx: RContext) {
        const apiKey = ctx.query.api_key;
        if (apiKey !== this.envService.apiKey) {
            ctx.unauthorized();
            ctx.res.end();
        }
    }
}
