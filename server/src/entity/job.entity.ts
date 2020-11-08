import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { JobApplication } from './jobapplication.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  name!: string;

  @Column('text')
  @IsString()
  description!: string;

  @Column()
  @IsString()
  @IsOptional()
  journal?: string;

  @Column()
  @IsString()
  @IsOptional()
  language?: string;

  @Column()
  @IsInt()
  @IsPositive()
  pay!: number;

  @Column('boolean', { default: false })
  deleted: boolean = false;

  @OneToMany(() => Comment, (comment) => comment.job)
  comments!: Comment[];

  @ManyToOne(() => User, (user) => user.jobs)
  owner!: User;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.job)
  applications!: JobApplication[];
}
