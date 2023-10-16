import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../models';
import { RaidHubService } from '../services/raid-hub-service';

export class MyScheduleCommand implements ICommand {
    @Inject private raidHubService: RaidHubService;
    name: 'MySchedule';
    aliases = ['myschedule', 'mySchedule'];
    help = 'Tells you your full raid schedule.';

    async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
        const { message, user } = cmdArgs;
        const raidTimes = await this.raidHubService.getRaidTimes(user.id).catch(() => null);
        let reply: string;
        if (!raidTimes) {
            reply = 'I don\'t recognize you. It seems like you haven\'t logged into the website before.';
        } else if (raidTimes.length > 0) {
            reply = 'You have the following weekly raid days :\n';
            // Build string of day: -> [raid time] display
            for (const raidTime of raidTimes) {
                const purpose = raidTime.raidGroup.purpose ? raidTime.raidGroup.purpose : 'Raiding';
                const discordTimestamp = `<t:${raidTime.unixTimestamp}:F>`;
                reply += ('\t'+discordTimestamp+' '+purpose +' with '+raidTime.raidGroup.name + '\n');
            }
        } else {
            reply = 'You haven\'t setup a schedule yet.';
        }
        await message.reply(reply);
        return { resultString: 'my schedule for ' + user.username + user.discriminator };
    }
}
