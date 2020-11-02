export enum Role {
  JOB_CREATOR = 'JOB_CREATOR',
  JOB_SEEKER = 'JOB_SEEKER',
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}
