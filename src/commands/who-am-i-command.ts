import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../models';
import { RaidHubService } from '../services/raid-hub-service';
import { RaidHubCharacter } from '../models/RaidHubCharacter';

export class WhoAmICommand implements ICommand {
    @Inject private raidHubService: RaidHubService;
    name: 'WhoAmI';
    help = 'Tells you what the XIV Raid Hub service knows about you.';
    aliases = ['whoami', 'whoAmI']
    async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
        const { message, user } = cmdArgs;
        const characters = await this.raidHubService.getCharacters(user.id).catch<null>(() => null);
        let reply: string;
        if (characters) {
            reply = `Hello ${user.username}, `;
            const ownedCharacters = characters.filter((chr: RaidHubCharacter) => chr.isOwner);
            if (ownedCharacters.length > 0) {
                reply += 'I recognize you as the owner of ';
                ownedCharacters.forEach((chr: RaidHubCharacter, index: number) => {
                    if (index === ownedCharacters.length - 1 && ownedCharacters.length > 1) {
                        reply += 'and ';
                    }
                    reply += `${chr.character.name} (${chr.character.server})`
                    if (index < ownedCharacters.length - 1) {
                        reply += ', ';
                    }
                });
                reply += '.';
            } else {
                reply += 'I recognize you, but you haven\'t confirmed any characters as yours.';
            }
        } else {
            reply = 'I don\'t recognize you. It seems like you haven\'t logged into the website before.';
        }
        await message.reply(reply);
        return { resultString: 'who is ' + user.username + user.discriminator };
    }
}
