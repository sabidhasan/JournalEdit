import { Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  text!: string;

  @ManyToOne(() => Job, job => job.comments)
  job!: Job;

  @ManyToOne(() => User, user => user.comments)
  user!: User;
}
