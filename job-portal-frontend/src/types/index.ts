export interface Job {
  _id: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
}

export interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  // company: string;
  // userId: string;
  // status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  // coverLetter: string;
  // resume: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  resumeLink: string;
  linkedin?: string;
  portfolio?: string;
  experience?: string;
  education?: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
}

export interface User {
  _id: string;
  token: string;
  // id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  company?: string;
}