import { getRepository, getManager } from 'typeorm';
import { User } from '../entity/user.entity';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  return await getManager().findOne(User, { where: { email, } });
};

export const createUser = async (newUser: User): Promise<void> => {
  const userRepository = getRepository(User);
  try {
    await userRepository.save(userRepository.create(newUser));
  } catch (error) {
    throw new Error(error);
  }
};
