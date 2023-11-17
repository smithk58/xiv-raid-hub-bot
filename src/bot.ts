import { Client } from 'discord.js';
import { Inject } from 'typescript-ioc';

import { ICommandResult } from './models';
import { LoggerService } from './services/logger-service';
import { CommandParserService } from './services/command-parser-service';
import { EnvService } from './services/env-service';
import { DiscordClientApiService } from './services/discord-client-api-service';
import { AlarmSchedulerService } from './services/alarm-scheduler-service';

export class Bot {
  @Inject private logger: LoggerService;
  @Inject private commandParser: CommandParserService;
  @Inject private envService: EnvService;
  @Inject private discordClientAPIService: DiscordClientApiService
  @Inject private alarmScheduler: AlarmSchedulerService
  public async init() {
    const DISCORD_TOKEN = this.envService.discordToken;
    const COMMAND_PREFIX = this.envService.commandPrefix;
    if (!DISCORD_TOKEN) { throw new Error('No Discord token specified!'); }

    const client = new Client();
    await client.login(DISCORD_TOKEN);
    client.on('ready', () => {
      this.logger.log('Initialized bot!');
      // Set bots status to a note about !help command
      void client.user.setActivity('!help', { type: 'LISTENING' });
      // Init services that need access to client
      this.discordClientAPIService.init(client);
      this.alarmScheduler.init(client);
      // Start alarm scheduler
      this.alarmScheduler.startScheduling();
    });

    client.on('message', async (msg) => {
      if (msg.author.bot || msg.author.id === client.user.id) { return; }
      // TODO Channel restrictions for efficiency?
      const content = msg.content;
      if (content.startsWith(COMMAND_PREFIX)) {
        const isDM = msg.channel.type === 'dm';
        const result: ICommandResult = await this.commandParser.handleCommand(msg, isDM);
        this.logger.logCommandResult(result);
      }
    });

    client.on('guildCreate', guild => {
      this.discordClientAPIService.addGuild(guild);
    });

    client.on('guildDelete', guild => {
      this.discordClientAPIService.removeGuild(guild);
    });
  }
}
