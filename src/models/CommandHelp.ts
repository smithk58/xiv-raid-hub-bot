export interface CommandHelp {
    command: string;
    aliases: string[];
    help: string;
    examples?: Record<string, string>;
}
