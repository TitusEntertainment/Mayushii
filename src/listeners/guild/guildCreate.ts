import { Listener } from 'discord-akairo';
import { Guild, Message, GuildMember } from 'discord.js';
import MayushiiClient from 'src/client/MayushiiClient';

export default class GuildCreate extends Listener {
  public client: MayushiiClient;

  public constructor() {
    super('guildCreate', {
      emitter: 'client',
      category: 'guild',
      event: 'guildCreate',
    });
  }

  public async exec(guild:Guild) {
      
  }
}
