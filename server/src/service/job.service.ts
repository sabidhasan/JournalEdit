import { getRepository, getManager } from 'typeorm';
import { Job } from '../entity/job.entity';

export const getJobsForUser = async (ownerId: number): Promise<Job[]> => {
  const entityManager = getManager();

  return await entityManager.find(Job, { where: { owner: ownerId, } }) || [];
};
