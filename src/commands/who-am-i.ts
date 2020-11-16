import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../models';
import { RaidHubService } from '../services/raid-hub-service';

/*export class WhoAmI implements ICommand {
    @Inject private raidHubService: RaidHubService;
    help = 'Tells you what the XIV Raid Hub service knows about you.'
    aliases = ['whoami', 'whoAmI']
    async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
        const { message, user } = cmdArgs
        const result = 'Nothing!'; // await this.raidHubService.whoIsUser(user.id)
        message.reply(result);
        return { resultString: 'who is ' + user.username + user.discriminator };
    }
}*/
