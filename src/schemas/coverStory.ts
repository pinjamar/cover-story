// Cover Story schema
export interface CoverStory {
  id: string;
  applicationId: string;
  userId: string;
  content: string;
  tone: 'professional' | 'casual' | 'enthusiastic' | 'formal';
  generatedAt: Date;
  customizations?: Record<string, any>;
  // Add cover story-specific fields here
}
