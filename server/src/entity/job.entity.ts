import { Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { JobApplication } from './jobapplication.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column('text')
  description!: string;

  @Column()
  journal!: string;

  @Column()
  language!: string;

  @Column()
  pay!: number;

  @OneToMany(() => Comment, (comment) => comment.job)
  comments!: Comment[];

  @ManyToOne(() => User, (user) => user.jobs)
  owner!: User;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.job)
  applications!: JobApplication[];
}
