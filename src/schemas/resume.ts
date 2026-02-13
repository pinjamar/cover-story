// Resume schema
export interface Resume {
  id: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
  };
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  // Add resume-specific fields here
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate?: Date;
}
