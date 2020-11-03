import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  @IsString()
  text!: string;

  @ManyToOne(() => Job, job => job.comments)
  job!: Job;

  @ManyToOne(() => User, user => user.comments)
  user!: User;
}
