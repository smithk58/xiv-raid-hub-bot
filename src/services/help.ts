import { Singleton } from 'typescript-ioc';

@Singleton
export class HelpService {
    private helpTexts: Array<{ command: string, aliases: string[], help: string }> = [];
    public get allHelp() {
        return this.helpTexts;
    }

    public addHelp(help: { command: string, aliases: string[], help: string }) {
        this.helpTexts.push(help);
    }
}
