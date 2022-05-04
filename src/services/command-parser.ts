
import { Inject, Singleton } from 'typescript-ioc';
import { Message } from 'discord.js';

import { ICommandResult, ICommand } from '../models';
import * as Commands from '../commands';
import { HelpService } from './help';

@Singleton
export class CommandParser {
  @Inject private helpService: HelpService;
  private executableCommands: { [key: string]: ICommand } = {};
  constructor() {
    this.loadCommands(Commands);
  }

  /**
   * Used to handle commands. Each command can register a set of aliases that fire off a callback. No alias overlapping
   * is allowed.
   * @param message - The message from discord.
   * @param isDM - Whether or not the message is a direct message to the bot.
   */
  async handleCommand(message: Message, isDM: boolean): Promise<ICommandResult> {
    const cmd = message.content.split(' ')[0].substring(1);
    const cmdInst = this.executableCommands[cmd];
    if (!cmdInst || cmdInst.dmOnly && !isDM) { return; }
    const args = message.content.substring(message.content.indexOf(cmd) + cmd.length + 1);
    return cmdInst.execute({
      debug: false,
      args,
      message,
      user: message.author
    });
  }

  /**
   * Loads all the commands in the /commands/index.ts file
   * @param commands - A list of commands to load.
   */
  private loadCommands(commands: typeof Commands) {
    Object.keys(commands).forEach((cmdName) => {
      /* eslint-disable */
      // @ts-ignore but can't force enforce constructor w/ interface
      const cmdInst = new Commands[cmdName]() as ICommand;
      /* eslint-enable */
      this.registerCommand(cmdInst);
    });
  }

  /**
   * Registers a command with this service for automatic handling.
   * @param cmdInst - An instance of the command to register.
   */
  private registerCommand(cmdInst: ICommand) {
    if (cmdInst.help && cmdInst.aliases) {
      this.helpService.addHelp({ command: cmdInst.constructor.name, aliases: cmdInst.aliases, help: cmdInst.help });
    }
    if (cmdInst.aliases) {
      cmdInst.aliases.forEach((alias) => {
        if (this.executableCommands[alias]) {
          const curCmd = cmdInst.name;
          const existingCmd = this.executableCommands[alias].name;
          throw new Error(
            `Cannot re-register alias "${alias}". Trying to register ${curCmd} but already registered ${existingCmd}.`
          );
        }

        if (!cmdInst.execute) { throw new Error(`Command "${alias}" does not have an execute function.`); }
        this.executableCommands[alias] = cmdInst;
      });
    }
  }
}
