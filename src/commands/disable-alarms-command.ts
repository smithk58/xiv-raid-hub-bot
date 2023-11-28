import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../models';
import { RaidHubService } from '../services/raid-hub-service';

export class DisableAlarmsCommand implements ICommand {
    @Inject private raidHubService: RaidHubService;
    name: 'DisableAlarms';
    aliases = ['disablealarms', 'disableAlarms'];
    help = 'Disables all alarms you have access to. If used in a channel it will only affect ones assigned to that channel.';

    async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
        const { message, user } = cmdArgs;
        const channelId = message.channel.type !== 'dm' ? message.channel.id : undefined;
        const result = await this.raidHubService.toggleAlarmStatus(false, user.id, channelId).catch<null>(() => null);
        let reply: string;
        if (!result) {
            reply = 'I don\'t recognize you. It seems like you haven\'t logged into the website before.';
        } else if (result.amountUpdated > 0) {
            reply = result.amountUpdated + ' alarms were disabled.';
        } else {
            reply = 'You don\'t have any alarms to disable.';
        }
        await message.reply(reply);
        return { resultString: 'disable alarms for ' + user.username + user.discriminator };
    }
}
