import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../models';
import { RaidHubService } from '../services/raid-hub-service';

export class EnableAlarmsCommand implements ICommand {
    @Inject private raidHubService: RaidHubService;
    name: 'EnableAlarms';
    aliases = ['enablealarms', 'enableAlarms'];
    help = 'Enables all alarms you have access to. If used in a channel it will only affect ones assigned to that channel.';

    async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
        const { message, user } = cmdArgs;
        const channelId = message.channel.type !== 'dm' ? message.channel.id : undefined;
        const result = await this.raidHubService.toggleAlarmStatus(true, user.id, channelId).catch<null>(() => null);
        let reply: string;
        if (!result) {
            reply = 'I don\'t recognize you. It seems like you haven\'t logged into the website before.';
        } else if (result.amountUpdated > 0) {
            reply = result.amountUpdated + ' alarms were enabled.';
        } else {
            reply = 'You don\'t have any alarms to enable.';
        }
        await message.reply(reply);
        return { resultString: 'enable alarms for ' + user.username + user.discriminator };
    }
}
