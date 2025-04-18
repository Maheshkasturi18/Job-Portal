export interface Job {
  _id: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
  salaryMin: number;
  salaryMax: number;
  salaryType: "per_month" | "per_annum" | "per_hour";
  currency: "INR" | "USD" | "EUR";
}

export interface Application {
  _id: string;
  jobId: Job | string;
  jobTitle: string;
  company: string;
  // userId: string;
  // status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
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
  appliedAt: string;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  email: string;
  role: "employer" | "jobseeker";
  company?: string;
}
