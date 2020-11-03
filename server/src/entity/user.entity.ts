import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { IsString, IsEmail, } from 'class-validator';
import { Job } from './job.entity';
import { Comment } from './comment.entity';
import { JobApplication } from './jobapplication.entity';

export enum Role {
  JOB_CREATOR = 'JOB_CREATOR',
  JOB_SEEKER = 'JOB_SEEKER',
}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  name!: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  @IsString()
  password!: string;

  @Column()
  @IsString()
  language!: string;

  @Column()
  @IsString()
  country!: string;

  @Column()
  role!: Role;

  @OneToMany(() => Job, (job) => job.owner)
  jobs!: Job[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.applicant)
  jobApplications!: JobApplication[];
}
