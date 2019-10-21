import { connect, Connection, connection } from 'mongoose';
import { Logger } from '@ayana/logger';
import _Guild, { IGuild } from './models/_guild';
const logger = Logger.get('database');
import { Guild, Message } from 'discord.js';
import { promises } from 'dns';

interface DbConfig {
  URI?: string;
}

export class DatabaseHandler {
  private connection: Connection = connection;

  public constructor(private config: DbConfig = {}) {
    if (!this.config.URI) throw new Error('Please provide a valid mongoDB URI!');

    this.connection
      .on('connected', () => logger.info('Connected to database'))
      .on('err', err => logger.error(err))
      .on('disconnected', () => logger.warn('Database has disconnected'));
  }

  public async Guild(message: Message): Promise<void> {
    const data = _Guild.findOne({ _id: message.guild.id });
    if (data) Promise.reject('This guild already exists in this db');
    const NewGuild = new _Guild({
      _id: message.guild.id,
      name: message.guild.name,
    });

    try {
      await NewGuild.save();
    } catch (error) {
      logger.error(error);
      return Promise.reject('something went wrong saving to the db. Please try again.');
    }
    return Promise.resolve();
  }

  public async GetGuild(message: Message): Promise<IGuild> {
    return _Guild.findOne({ _id: message.guild.id });
  }

  public async EditGuild(message: Message, prefix: string): Promise<void> {
    let data = await _Guild.findOne({ _id: message.guild.id });

    return await _Guild.updateOne({ prefix });
  }

  public async init() {
    return await connect(
      this.config.URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4,
      }
    );
  }
}
