import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  JOB_CREATOR = 'JOB_CREATOR',
  JOB_SEEKER = 'JOB_SEEKER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: Role;
}
