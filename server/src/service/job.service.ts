import { getRepository, getManager } from 'typeorm';
import { Job } from '../entity/job.entity';
import { JobApplication } from '../entity/jobapplication.entity';

export const getJobsForJobCreator = async (ownerId: number): Promise<Job[]> => {
  const entityManager = getManager();
  return await entityManager.find(Job, { where: { owner: ownerId, } }) || [];
};

export const getJobsForJobSeeker = async (applicant: number): Promise<Job[]> => {
  const entityManager = getManager();
  return await entityManager.find(JobApplication, {
    where: { applicant },
    relations: ['job'],
  }) as any;
};

export const createJob = async (newJob: Job) => {
  const jobRepository = getRepository(Job);
  try {
    return await jobRepository.save(jobRepository.create(newJob));
  } catch (error) {
    throw new Error(error);
  }
}

export const findJobById = async (jobId?: number) => {
  if (!jobId) {
    return;
  }

  const entityManager = getManager();
  return await entityManager.findOne(Job, jobId);
}

export const applyToJob = async (job: Job, application: JobApplication) => {
  // const jobRepository = getRepository(Job);
  const jobApplicationRepository = getRepository(JobApplication);
  console.log(job.applications)
  application.job = job;
  // job.applications.push(application);

  try {
    return await jobApplicationRepository.save(jobApplicationRepository.create(application));
    // return await jobRepository.save(jobRepository.create(job));
  } catch (error) {
    throw new Error(error);
  }
}