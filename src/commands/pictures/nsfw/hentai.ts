import { TitusClient } from '@titus_entertainment/api';
import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class HentaiCommand extends Command {
  public api = new TitusClient();

  public constructor() {
    super('hentai-command', {
      aliases: ['hentai'],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
    });
  }

  public async exec(message: Message) {
    //@ts-ignore
    if (!message.channel.nsfw) return message.util!.reply('This command is only avalible in **NSFW** channels');
    const api: TitusClient = new TitusClient();
    const data = await api.getHentai();

    if (!data.success) return;

    const post = data.data.hentai;

    const postEmbed: MessageEmbed = new MessageEmbed()
      .setColor(this.client.color)
      .setTitle(post.title)
      .setURL(`https://reddit.com${post.url}`)
      .setImage(post.image);

    return message.util!.send(postEmbed);
  }
}
