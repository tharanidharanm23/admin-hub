export type CourseStatus = 'draft' | 'published';
export type ContentCategory = 'video' | 'document' | 'image' | 'quiz';
export type AccessType = 'everyone' | 'signed-in' | 'open' | 'invitation' | 'paid';
export type ParticipantStatus = 'yet-to-start' | 'in-progress' | 'completed';

export interface Tag {
  id: string;
  name: string;
}

export interface CourseContent {
  id: string;
  title: string;
  category: ContentCategory;
  duration?: string;
  videoUrl?: string;
  fileUrl?: string;
  imageUrl?: string;
  allowDownload?: boolean;
  responsiblePerson?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'file' | 'link';
  name: string;
  url: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizRewards {
  firstAttempt: number;
  secondAttempt: number;
  thirdAttempt: number;
  fourthAndAbove: number;
}

export interface Course {
  id: string;
  name: string;
  tags: Tag[];
  status: CourseStatus;
  views: number;
  contentCount: number;
  totalDuration: string;
  responsiblePerson?: string;
  imageUrl?: string;
  description?: string;
  contents: CourseContent[];
  accessType: AccessType;
  price?: number;
  quiz: {
    questions: QuizQuestion[];
    rewards: QuizRewards;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  id: string;
  courseId: string;
  courseName: string;
  participantName: string;
  enrolledDate: Date;
  startDate?: Date;
  timeSpent: string;
  completionPercentage: number;
  completedDate?: Date;
  status: ParticipantStatus;
}

export interface ReportingMetrics {
  totalParticipants: number;
  yetToStart: number;
  inProgress: number;
  completed: number;
}

export type ViewMode = 'kanban' | 'list';
