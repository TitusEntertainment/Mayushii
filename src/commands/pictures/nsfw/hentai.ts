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
    if (!message.channel.nsfw)
      return message.util!.reply('This command is only avalible in **NSFW** channels');
    const fetch = await this.api.getHentai();
    const data = fetch.data.hentai;
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle(data.title)
      .setColor(this.client.color)
      .setImage(data.image)
      .setFooter(`Cached from: https://reddit.com/${data.url}`);

    return message.util!.send(embed);
  }
}
