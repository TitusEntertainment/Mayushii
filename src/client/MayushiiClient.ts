import { AkairoClient, CommandHandler, ListenerHandler, SQLiteProvider } from 'discord-akairo';
import { join } from 'path';
import { Message } from 'discord.js';
import Logger from '@ayana/logger';
import { DatabaseHandler } from '../db/DatabaseHandler';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    config: MayushiiOptions;
    listenerHandler: ListenerHandler;
    api_url: string;
    color: string;
    logger: Logger;
    db: DatabaseHandler;
  }
}

interface MayushiiOptions {
  owner?: string;
  token?: string;
  uri?;
}

export default class MayushiiClient extends AkairoClient {
  public config: MayushiiOptions = {};
  public logger = Logger.get('MayushiiClient');
  public db: DatabaseHandler;

  public commandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: async (msg: Message) => {
      const data = await this.db.GetGuild(msg);
      if (!data) return '.';
      else return data.prefix;
    },
    aliasReplacement: /-/g,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 4500,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str): string => `${str}\nType \`cancel\` to cancel the command.`,
        modifyRetry: (_, str): string => `${str}\nType \`cancel\` to cancel the command.`,
        timeout: 'You took to long, command has been canceled.',
        ended: 'Failed to provide valid arguments, command has been canceled.',
        cancel: 'The command has been cancelled.',
        retries: 3,
        time: 30000,
      },
      otherwise: '',
    },
  });

  public color: string = '#0eddf0';

  public listenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', 'listeners'),
  });

  public constructor(config: MayushiiOptions = {}) {
    super(
      { ownerID: config.owner },
      {
        messageCacheMaxSize: 1000,
        disableEveryone: true,
      }
    );

    this.config = config;
    this.db = new DatabaseHandler({ URI: this.config.uri });
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
    await this.commandHandler.loadAll();
    this.logger.info('Command handler loaded');
    await this.listenerHandler.loadAll();
    this.logger.info('Listener handler loaded');
    this.db.init();
    this.logger.info('Database has connected');
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
