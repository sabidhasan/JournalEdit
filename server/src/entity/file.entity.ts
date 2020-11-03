import { Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;

  @OneToOne(() => Job)
  @JoinColumn()
  job!: Job;
}
