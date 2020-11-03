import { getRepository, getManager } from 'typeorm';
import { User } from '../entity/user.entity';

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const entityManager = getManager();
  return await entityManager.findOne(User, { where: { email, } });
};

export const createUser = async (newUser: User): Promise<void> => {
  const userRepository = getRepository(User);
  try {
    await userRepository.save(userRepository.create(newUser));
  } catch (e) {
    throw new Error('User already exists');
  }
};
