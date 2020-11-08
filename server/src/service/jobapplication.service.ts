import { getRepository, getManager, In } from 'typeorm';
import { JobApplication } from '../entity/jobapplication.entity';
import { getJobsForJobCreator } from './job.service';

export const getApplicationsForSeeker = async (applicant: number): Promise<JobApplication[]> => {
  return await getManager().find(JobApplication, {
    where: { applicant },
    relations: ['job'],
  });
};

export const getApplicationsForCreator = async (ownerId: number): Promise<JobApplication[]> => {
  const jobsForOwner = (await getJobsForJobCreator(ownerId)).map((job) => job.id);
  
  return await getManager().find(JobApplication, {
    where: {
      job: In(jobsForOwner),
    },
    relations: ['job', 'applicant'],
  });
};


export const applyToJob = async (application: JobApplication) => {
  const jobApplicationRepository = getRepository(JobApplication);

  try {
    const newApp = await jobApplicationRepository.save(jobApplicationRepository.create(application));
    return await getManager().findOne(JobApplication, newApp.id);
  } catch (error) {
    throw new Error(error);
  }
};
