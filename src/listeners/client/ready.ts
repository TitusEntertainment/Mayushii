import { Listener } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';


export default class ReadEvent extends Listener {
  public client: MayushiiClient;

  public constructor() {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client',
    });
  }

  public async exec(): Promise<void> {
    this.client.user!.setActivity(`@${this.client.user.username} help 🐋`, { type: 'WATCHING' });
    console.log(`tu tu ruuuu! (^-^)`);

  }
}
