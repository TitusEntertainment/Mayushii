import { Listener, Command } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';
import { Message } from 'discord.js';
import { Logger } from '@ayana/logger';
const logger = Logger.get('Command Handler');

export default class CommandError extends Listener {
  public client: MayushiiClient;

  public constructor() {
    super('command-error', {
      event: 'error',
      emitter: 'commandHandler',
      category: 'commandHandler',
    });
  }

  public exec(error: Error, message: Message, command: Command) {
    logger.error(`Command: ${command} has errored. message: ${message}`, `${error}`);
  }
}
