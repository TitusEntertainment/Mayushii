import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import MayushiiClient from 'src/client/MayushiiClient';

export default class PrefixCommand extends Command {
  public client: MayushiiClient;

  public constructor() {
    super('setting-prefix', {
      aliases: ['prefix'],
      userPermissions: ['MANAGE_GUILD'],
      channel: 'guild',
      ratelimit: 2,
      description: {
        content: 'Displays or changes the prefix for this guild',
        usage: '[prefix]',
        examples: ['.', 'm/'],
      },
      args: [
        {
          id: 'prefix',
          type: 'string',
        },
      ],
    });
  }

  public async exec(message: Message, { prefix }: { prefix:string}) {
    if (!prefix)
      return message.util!.send(
        //@ts-ignore
        `The current prefix for this guild is: \`${await this.handler.prefix(message)}\``
      );

    this.client.settings.set(message.guild!, 'prefix', prefix);
    if (prefix === '!') {
      return message.util!.reply(`the prefix has been reset to \`${prefix}\``);
    }
    return message.util!.reply(`the prefix has been set to \`${prefix}\``);
  }
}
