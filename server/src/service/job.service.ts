import { getRepository, getManager } from 'typeorm';
import { Job } from '../entity/job.entity';

export const getJobsForUser = async (ownerId: number): Promise<Job[]> => {
  const entityManager = getManager();
return await entityManager.find(Job, { where: { owner: ownerId, } }) || [];
};

export const createJob = async (newJob: Job) => {
  const jobRepository = getRepository(Job);
  try {
    return await jobRepository.save(jobRepository.create(newJob));
  } catch (error) {
    throw new Error(error);
  }
}