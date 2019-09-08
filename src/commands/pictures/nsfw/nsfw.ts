import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import MayushiiClient from 'src/client/MayushiiClient';
import fetch from 'node-fetch';

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

    const query = `
          {
            nsfw {
                url
                title
                image
              }
          }
    `;

    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    };

    fetch(this.client.api_url, opts)
      .then(res => res.json())
      .then(res => {
        const embed: MessageEmbed = new MessageEmbed()
          .setTitle(res.data.nsfw.title)
          .setColor(this.client.color)
          .setURL(`https://reddit.com${res.data.nsfw.url}`)
          .setImage(res.data.nsfw.image);
        return message.util!.send(embed);
      });
  }
}
