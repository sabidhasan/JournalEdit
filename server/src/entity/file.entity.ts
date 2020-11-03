import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Job } from './job.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  fileName!: string;

  @OneToOne(() => Job)
  @JoinColumn()
  job!: Job;
}
