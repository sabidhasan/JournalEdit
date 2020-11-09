import { getRepository, getManager, In } from 'typeorm';
import { JobApplication } from '../entity/jobapplication.entity';
import { User } from '../entity/user.entity';
import { getJobsForJobCreator, deleteJob } from './job.service';
import app from '../app';

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


export const createJobApplication = async (application: JobApplication) => {
  const jobApplicationRepository = getRepository(JobApplication);

  try {
    const newApp = await jobApplicationRepository.save(jobApplicationRepository.create(application));
    return await getManager().findOne(JobApplication, newApp.id);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteJobApplication = async (application: JobApplication) => {
  try {
    const deleteStatus = await getRepository(JobApplication).delete(application);
    return deleteStatus.affected === 0 ? false : true;
  } catch {
    return false;
  }
};
