import { Singleton } from 'typescript-ioc';
import { Level } from 'pino';

@Singleton
export class EnvService {
    public get discordToken(): string {
        return process.env.DISCORD_BOT_TOKEN;
    }
    public get commandPrefix(): string {
        return process.env.COMMAND_PREFIX || '!';
    }
    public get baseAPIUrl(): string {
        return process.env.XIV_RAID_HUB_BASE_URL || 'https://api.xivraidhub.com';
    }
    public get raidHubAPIKey(): string {
        return process.env.XIV_RAID_HUB_API_KEY;
    }
    public get apiKey(): string {
        return process.env.API_KEY;
    }
    public get logLevel(): Level {
        return process.env.DEBUG_LOGGING === 'true' ? 'debug' : 'info';
    }
}
