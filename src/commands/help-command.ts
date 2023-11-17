import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../models';
import { HelpService } from '../services/help-service';
import { EnvService } from '../services/env-service';

export class HelpCommand implements ICommand {
    @Inject private envService: EnvService;
    @Inject private helpService: HelpService;
    name: 'Help';
    aliases = ['help'];
    helpMessage: string;

    async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
        const { message, user } = cmdArgs
        this.helpMessage = this.helpMessage ? this.helpMessage : this.buildHelpMessage();
        await message.reply(this.helpMessage);
        return { resultString: 'helped ' + user.username + user.discriminator };
    }
    buildHelpMessage(): string{
        // TODO display is DM only
        const prefix = this.envService.commandPrefix;
        const listOfCommands = this.helpService.allHelp;
        let msg = 'This bot is for interacting with https://www.xivraidhub.com\n';
        if (listOfCommands.length > 0) {
            msg += '**__All Commands__**\n';
            // Print the alias's and help text for each command
            listOfCommands.forEach(({ aliases, help }) => {
                msg += '\t' + aliases.map((alias) => '__' + prefix + alias + '__').join(', ')+ '\n';
                msg += '\t\t' + help;
                msg += '\n'
            });
        }
        return msg;
    }
}
