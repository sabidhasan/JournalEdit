import { getRepository, getManager } from 'typeorm';
import { Job } from '../entity/job.entity';

export const getJobsForJobCreator = async (ownerId: number): Promise<Job[]> => {
  return await getManager().find(Job, {
    where: {
      owner: ownerId,
      deleted: false,
    }
  });
};

export const createJob = async (newJob: Job) => {
  const jobRepository = getRepository(Job);
  try {
    return await jobRepository.save(jobRepository.create(newJob));
  } catch (error) {
    throw new Error(error);
  }
}

export const findJobById = async (jobId: number, ownerId?: number) => {
  if (!jobId) {
    return;
  }

  return await getRepository(Job)
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.applications', 'applications')
    .leftJoinAndSelect('applications.applicant', 'user')
    .where('job.id = :id', { id: jobId })
    .andWhere('job.deleted = false')
    .andWhere(ownerId !== undefined ? 'job.ownerId = :ownerId' : '1=1', { ownerId })
    .getOne();
};

export const deleteJob = async (jobId: number, ownerId: number) => {
  const job = await findJobById(jobId, ownerId);
  if (job) {
    // Update the job's delete state
    job.deleted = true;
    return await getRepository(Job).save(job);
  }

  return false;
};
