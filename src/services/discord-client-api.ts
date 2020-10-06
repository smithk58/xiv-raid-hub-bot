import { Inject, Singleton } from 'typescript-ioc';
import { Client, Guild, GuildChannel } from 'discord.js';

import { EnvService } from './env-service';

@Singleton
export class DiscordClientApiService {
    private client: Client;
    @Inject private envService: EnvService;
    private guildMap: Record<string, {id: string, name: string}> = {};
    async init(client: Client) {
        this.client = client;
        // TODO Not always hit in startup, maybe timing issue?
        // Populate guilds array with initial guilds the bot is in
        this.client.guilds.cache.forEach((guild: Guild) => {
            this.addGuild(guild);
        });
    }
    getGuilds() {
        return this.guildMap;
    }
    addGuild(guild: Guild) {
        this.guildMap[guild.id] = {id: guild.id, name: guild.name};
    }
    removeGuild(guild: Guild) {
        delete this.guildMap[guild.id];
    }
    getGuildTextChannels(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if(!guild)
            return null;
        const channels: {id: string, name: string}[] = [];
        guild.channels.cache.forEach((channel: GuildChannel) => {
            if(channel.type !== 'text')
                return;
            channels.push({id: channel.id, name: channel.name});
        });
        return channels;
    }
}
