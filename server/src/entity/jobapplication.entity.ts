import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsBoolean, IsString } from 'class-validator';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsBoolean()
  approved!: boolean;
  
  @Column()
  @IsString()
  text!: string;

  @ManyToOne(() => Job, job => job.applications)
  job!: Job;

  @ManyToOne(() => User, user => user.jobApplications)
  applicant!: User;
}
