import { User } from './entity/user.entity';
import { ConnectionOptions } from 'typeorm';

export const dbConnectionOptions: ConnectionOptions = {
  type: 'sqlite',
  //  host: 'localhost',
  //  port: 3306,
  //  username: 'root',
  //  password: 'admin',
  database: './db.sqlite',
  entities: [
      User,
  ],
  synchronize: true,
  logging: false
};
