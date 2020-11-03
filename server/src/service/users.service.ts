/**
 * Data Model Interfaces
 */
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';

// /**
//  * In-Memory Store
//  */
// const users: Users = {
//   0: {
//     id: 0,
//     firstName: 'Tacky',
//     lastName: 'Loonchanta',
//     email: 'tacky@tacky.com',
//     password: '5678',
//     role: Role.JOB_CREATOR,
//   },
//   1: {
//     id: 1,
//     firstName: 'Abid',
//     lastName: 'Hasan',
//     email: 'abid@abid.com',
//     password: '1234',
//     role: Role.JOB_SEEKER,
//   },
// };

/**
 * Service Methods
 */
// export const findAll = async (): Promise<Users> => {
//   return users;
// };

export const find = async (id: number): Promise<any> => {
  const entityManager = getManager();
  const users = await entityManager.find(User);
  console.log(users);
  return users;
};

export const create = async (newUser: any): Promise<void> => {
//   const id = new Date().valueOf();

//   users[id] = {
//     ...newUser,
//     id,
//   };
};

export const remove = async (id: number): Promise<void> => {
//   const record: User = users[id];

//   if (record) {
//     delete users[id];
//   } else {
//     throw new Error('No record found to delete');
//   }
};
