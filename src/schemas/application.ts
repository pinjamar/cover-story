// Application schema
export interface Application {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  status: 'draft' | 'submitted' | 'in-review' | 'rejected' | 'accepted';
  createdAt: Date;
  updatedAt: Date;
  // Add application-specific fields here
}
