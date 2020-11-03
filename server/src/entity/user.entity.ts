import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Job } from './job.entity';
import { Comment } from './comment.entity';
import { JobApplication } from './jobapplication.entity';

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
  language!: string;

  @Column()
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
