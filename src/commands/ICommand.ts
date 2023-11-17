import { Message, User } from 'discord.js';

export interface ICommandResult {
  resultString?: string;
  result?: any;
}

export interface ICommandArgs {
  debug?: boolean;
  args: string;
  message?: Message;
  user?: User;
}

// commands are created once, and then run multiple times as needed.
export interface ICommand {
  name: string;
  aliases: string[];
  help?: string;
  dmOnly?: boolean; // default is false
  examples?: Record<string, string>;
  // run when the aliases are matched, and if the function is added to the command
  execute?(args: ICommandArgs): Promise<ICommandResult>;
}
