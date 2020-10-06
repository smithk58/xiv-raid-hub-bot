import { Singleton } from 'typescript-ioc';

@Singleton
export class HelpService {

    public get allHelp() {
        return this.helpTexts;
    }

    private helpTexts: Array<{ command: string, aliases: string[], help: string }> = [];

    public addHelp(help: { command: string, aliases: string[], help: string }) {
        this.helpTexts.push(help);
    }
}
