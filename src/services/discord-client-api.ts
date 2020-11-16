import { Inject, Singleton } from 'typescript-ioc';
import { Client, Guild, GuildChannel, Role } from 'discord.js';

import { EnvService } from './env-service';
import { IdNamePair } from '../models/IdNamePair';
import { SimpleGuild } from '../models/SimpleGuild';

@Singleton
export class DiscordClientApiService {
    private client: Client;
    @Inject private envService: EnvService;
    private guildMap: Record<string, SimpleGuild> = {};
    async init(client: Client) {
        this.client = client;
        // Populate guilds array with initial guilds the bot is in
        this.client.guilds.cache.forEach((guild: Guild) => {
            this.addGuild(guild);
        });
    }
    getGuilds() {
        return this.guildMap;
    }
    getGuild(guildId: string): SimpleGuild {
        const guild = this.guildMap[guildId];
        if(!guild)
            return null;
        guild.channels = this.getGuildTextChannels(guildId);
        guild.roles = this.getGuildRoles(guildId);
        return guild;
    }
    addGuild(guild: Guild) {
        this.guildMap[guild.id] = {id: guild.id, name: guild.name};
    }
    removeGuild(guild: Guild) {
        delete this.guildMap[guild.id];
    }
    getGuildTextChannels(guildId: string): IdNamePair[] {
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
    getGuildRoles(guildId: string): IdNamePair[] {
        const guild = this.client.guilds.cache.get(guildId);
        if(!guild)
            return null;
        const channels: {id: string, name: string}[] = [];
        guild.roles.cache.forEach((role: Role) => {
            channels.push({id: role.id, name: role.name});
        });
        return channels;
    }
}
