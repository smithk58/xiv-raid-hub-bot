import { Singleton } from 'typescript-ioc';
import { CommandHelp } from '../models/CommandHelp';

@Singleton
export class HelpService {
    private helpTexts: Array<CommandHelp> = [];
    public get allHelp() {
        return this.helpTexts;
    }
    public addHelp(help: CommandHelp) {
        this.helpTexts.push(help);
    }
}
