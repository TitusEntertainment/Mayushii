import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Guild } from 'discord.js';

@Entity()
export class GuildModel extends BaseEntity {
  @PrimaryColumn()
  guildId!: string;

  @Column()
  prefix!: string;
}
