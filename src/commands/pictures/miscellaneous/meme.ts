import { Command } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

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
    const query = `
    {
      meme {
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
            `${res.data.meme.title}`,
            'https://a.thumbs.redditmedia.com/JkyImC_zyl4XzE_yW-G4KOUTTFB6MRHUR3eEHvrpq64.png',
            `https://reddit.com${res.data.meme.url}`
          )
          .setColor(this.client.color)
          .setURL(`https://reddit.com${res.data.meme.url}`)
          .setImage(res.data.meme.image);
        return message.util!.send(embed);
      });
  }
}
