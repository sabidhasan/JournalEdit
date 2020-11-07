import { User } from './entity/user.entity';
import { Job } from './entity/job.entity';
import { File } from './entity/file.entity';
import { Comment } from './entity/comment.entity';
import { JobApplication } from './entity/jobapplication.entity';

import { ConnectionOptions } from 'typeorm';

export const dbConnectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: './db.sqlite',
  entities: [
    User,
    Job,
    File,
    Comment,
    JobApplication,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
};

export const JWT_EXPIRATION_MS = 1_200_000;
export const HASH_COST = 10;
