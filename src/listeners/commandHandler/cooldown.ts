import { Listener, Command } from 'discord-akairo';
import ms from 'ms';
import { Message } from 'discord.js';

export default class CooldownListner extends Listener {
  public constructor() {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler',
    });
  }

  public async exec(message: Message, command: Command, remaning) {
    return message.util!.send(
      `Please wait \`\`${ms(remaning)}\`\` before using the command \`\`${command}\`\`, I'm busy eating my bento 🍱`
    );
  }
}
