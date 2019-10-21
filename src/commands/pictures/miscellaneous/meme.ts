import { Command } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { TitusClient } from '@titus_entertainment/api';

export default class MemeCommand extends Command {
  client: MayushiiClient;

  public constructor() {
    super('meme-command', {
      aliases: ['meme', 'dankmeme', 'memes'],
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      channel: 'guild',
    });
  }

  public async exec(message: Message) {
    const api: TitusClient = new TitusClient();
    const data = await api.getMeme();

    if (!data.success) return;

    const meme = data.data.meme;

    const memeEmbed: MessageEmbed = new MessageEmbed()
      .setColor(this.client.color)
      .setTitle(meme.title)
      .setURL(`https://reddit.com${meme.url}`)
      .setImage(meme.image);

    return message.util!.send(memeEmbed);
  }
}
