import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import MayushiiClient from 'src/client/MayushiiClient';
import { TitusClient } from '@titus_entertainment/api';
export default class NsfwCommand extends Command {
  public client: MayushiiClient;
  public constructor() {
    super('nsfw-command', {
      aliases: ['nsfw'],
      channel: 'guild',
    });
  }

  public async exec(message: Message) {
    //@ts-ignore
    if (!message.channel.nsfw) return message.util!.reply('You cannot use this command in a non nsfw channel!');

    const api: TitusClient = new TitusClient();
    const data = await api.getNsfw();

    if (!data.success) return;

    const post = data.data.nsfw;

    const postEmbed: MessageEmbed = new MessageEmbed()
      .setColor(this.client.color)
      .setTitle(post.title)
      .setURL(`https://reddit.com${post.url}`)
      .setImage(post.image);

    return message.util!.send(postEmbed);
  }
}
