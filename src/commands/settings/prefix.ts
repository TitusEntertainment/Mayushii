import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import MayushiiClient from 'src/client/MayushiiClient';

export default class PrefixCommand extends Command {
  public client: MayushiiClient;

  public constructor() {
    super('setting-prefix', {
      aliases: ['prefix'],
      userPermissions: ['MANAGE_CHANNELS'],
      args: [
        {
          id: 'newPrefix',
          type: 'string',
        },
      ],
    });
  }

  public async exec(message: Message, { newPrefix }) {
    if (!newPrefix)
      return message.util!.send(
        //@ts-ignore
        `The current prefix for this guild is: \`${await this.handler.prefix(message)}\``
      );

    this.client.settings.set(message.guild!, 'prefix', newPrefix);
    if (newPrefix === '!') {
      return message.util!.reply(`the prefix has been reset to \`${newPrefix}\``);
    }
    return message.util!.reply(`the prefix has been set to \`${newPrefix}\``);
  }
}
