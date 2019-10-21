import { Command } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';
import { Message, MessageEmbed } from 'discord.js';
import { TitusClient } from '@titus_entertainment/api';
export default class UnixPornCommand extends Command {
  client: MayushiiClient;

  public constructor() {
    super('unixporn-command', {
      aliases: ['unix', 'unixporn', 'r/unixporn'],
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      channel: 'guild',
    });
  }

  public async exec(message: Message) {
    const api: TitusClient = new TitusClient();
    const data = await api.getUnixPorn();

    if (!data.success) return;

    const post = data.data.unixporn;

    const postEmbed: MessageEmbed = new MessageEmbed()
      .setColor(this.client.color)
      .setTitle(post.title)
      .setURL(`https://reddit.com${post.url}`)
      .setImage(post.image);

    return message.util!.send(postEmbed);
  }
}
