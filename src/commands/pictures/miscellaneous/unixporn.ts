import { Command } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

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
    const query = `
    {
      unixporn {
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
          .setAuthor(
            `${res.data.unixporn.title}`,
            `https://i.imgur.com/rUmaedY.png`,
            `https://reddit.com${res.data.unixporn.url}`
          )
          .setColor(this.client.color)
          .setURL(`https://reddit.com${res.data.unixporn.url}`)
          .setImage(res.data.unixporn.image);
        return message.util!.send(embed);
      });
  }
}
