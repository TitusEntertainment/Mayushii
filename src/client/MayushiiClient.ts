import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { join } from 'path';
import { Message, MessageEmbed, Channel, ShardingManager } from 'discord.js';
import { Connection, createConnection } from 'typeorm';
import { getMongoRepository } from 'typeorm';
import { GuildModel } from '../db/models/Guild.Model';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    config: MayushiiOptions;
    listenerHandler: ListenerHandler;
    api_url: string;
    color: string;
    db: Connection;
  }
}

interface MayushiiOptions {
  owner?: string;
  token?: string;
}

export default class MayushiiClient extends AkairoClient {
  public db: Connection;

  public GuildRepo = getMongoRepository(GuildModel);

  public commandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: async (message: Message): Promise<string> => {
      const data = await this.GuildRepo.findOne({ guildId: message.guild.id });
      if (!data) return '!';
      return data.prefix;
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
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
