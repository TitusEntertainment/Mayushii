import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Guild } from 'discord.js';

@Entity()
export class GuildModel extends BaseEntity {
  @PrimaryColumn()
  guildId!: string;

  @Column()
  prefix!: string;

  static findByGuildId(guild: Guild) {
    const id = guild.id;
    return this.createQueryBuilder('Guild')
      .where('guild.guildId = :guildId', { id })
      .getMany();
  }
}
