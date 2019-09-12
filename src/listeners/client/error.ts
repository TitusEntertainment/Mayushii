import { Listener } from 'discord-akairo';
import MayushiiClient from 'src/client/MayushiiClient';

export default class ClientError extends Listener {
  public client: MayushiiClient;

  public constructor() {
    super('client-error', {
      event: 'error',
      emitter: 'client',
      category: 'client',
    });
  }

  public exec(error: Error) {
    return this.client.logger.error('Client error:', `${error}`);
  }
}
