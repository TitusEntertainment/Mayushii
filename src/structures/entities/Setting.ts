import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Setting extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  test!: string;
}
