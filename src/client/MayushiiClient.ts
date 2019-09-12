import { AkairoClient, CommandHandler, ListenerHandler, SQLiteProvider } from 'discord-akairo';
import { join } from 'path';
import { Message } from 'discord.js';
import { Connection, createConnection, Db } from 'typeorm';
import { getMongoRepository, getMongoManager } from 'typeorm';
import sqlite from 'sqlite';
import { Setting } from '../db/models/Settings';
import TypeORMProvider from '../db/SettingsProvider';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    config: MayushiiOptions;
    listenerHandler: ListenerHandler;
    api_url: string;
    color: string;
    db: Connection;
    settings: TypeORMProvider;
  }
}

interface MayushiiOptions {
  owner?: string;
  token?: string;
}

export default class MayushiiClient extends AkairoClient {
  public db!: Connection;
  public settings!: TypeORMProvider;

  public commandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: (message: Message): string => this.settings.get(message.guild!, 'prefix', '!'),
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

  public api_url: string = 'http://titusentertainment.xyz:3200/api';

  public constructor(config: MayushiiOptions) {
    super(
      { ownerID: config.owner },
      {
        messageCacheMaxSize: 1000,
        disableEveryone: true,
      }
    );

    this.config = config;
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
    this.commandHandler.loadAll();
    console.log('Command handler loaded');
    this.listenerHandler.loadAll();
    console.log('Listener handler loaded');
    const isProd = process.env.NODE_ENV === 'production';
    this.db = await createConnection({
      type: 'postgres',
      database: 'Mayushii',
      host: 'localhost',
      port: 5432,
      name: 'Mayushii',
      synchronize: !isProd,
      logging: !isProd,
      entities: [Setting],
    });
    console.log('Connected to db');
    // @ts-ignore
    this.settings = new TypeORMProvider(this.db.getRepository(Setting));
    await this.settings.init();
    console.log('Inited guild settings');
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
