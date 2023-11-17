
import { Inject, Singleton } from 'typescript-ioc';
import { Message } from 'discord.js';

import { ICommandResult, ICommand } from '../models';
import * as Commands from '../commands';
import { HelpService } from './help-service';

@Singleton
export class CommandParserService {
  @Inject private helpService: HelpService;
  private executableCommands: Record<string, ICommand> = {};
  constructor() {
    this.loadCommands(Commands.default);
  }

  /**
   * Used to handle commands. Each command can register a set of aliases that fire off a callback. No alias overlapping
   * is allowed.
   * @param message - The message from discord.
   * @param isDM - Whether the message is a direct message to the bot.
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
   * @param commands - A list of command constructors to load.
   */
  private loadCommands(commands: (new () => ICommand)[]) {
    commands.forEach((iCommandConstructor) => {
      const cmdInstance = new iCommandConstructor();
      this.registerCommand(cmdInstance);
    });
  }

  /**
   * Registers a command with this service for automatic handling.
   * @param cmdInst - An instance of the command to register.
   */
  private registerCommand(cmdInst: ICommand) {
    if (cmdInst.help && cmdInst.aliases) {
      this.helpService.addHelp({ command: cmdInst.constructor.name, aliases: cmdInst.aliases, help: cmdInst.help, examples: cmdInst.examples  });
    }
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
