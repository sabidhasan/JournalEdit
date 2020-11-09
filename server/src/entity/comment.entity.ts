import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  @IsString()
  @Length(10)
  text!: string;

  @Column('integer', { default: 0 })
  likes: number = 0;

  @Column('boolean', { default: false })
  deleted: boolean = false;

  @CreateDateColumn({ type: 'date' })
  created?: Date;

  @ManyToOne(() => Job, job => job.comments)
  job!: Job;

  @ManyToOne(() => User, user => user.comments)
  user!: User;
}
