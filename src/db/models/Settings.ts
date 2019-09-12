import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Setting extends BaseEntity {
  @PrimaryColumn({ type: 'bigint' })
	public guild!: string;

	@Column({ 'type': 'jsonb', 'default': (): string => "'{}'" })
	public settings!: any;
}
