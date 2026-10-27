export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string; // for teacher
  designation?: string; // for teacher
  rollNumber?: string; // for student
  program?: string; // for student
  section?: string; // for student
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Classroom {
  id: string;
  code: string;
  title: string;
  subject: string;
  description: string;
  section: string;
  teacherId: string;
  teacherName: string;
  scheduledTime: string;
  activeSession: boolean;
  studentCount: number;
  currentTopic: string;
  createdAt: string;
  enrolledStudents?: string[]; // student IDs
}

export type ContentType = 'NOTE' | 'PRESENTATION' | 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';

export interface StudyMaterial {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  type: ContentType;
  fileUrl?: string;
  fileSize?: string;
  contentBody?: string;
  isPublished: boolean;
  sequenceOrder: number;
  uploadedAt: string;
  completedByStudentIds?: string[]; // tracks sequential learning completion
}

export interface AttendanceRecord {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  verified: boolean;
  verificationMethod: 'Biometric Check' | 'Device Fingerprint' | 'Browser Environment' | 'Manual Teacher Mark';
  deviceFingerprint: string;
  timestamp: string;
}

export type QuestionType = 'MCQ' | 'SHORT_ANSWER';

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  marks: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  status: 'draft' | 'published' | 'closed';
  maxMarks: number;
  createdAt: string;
  dueDate?: string;
}

export interface Homework {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  maxMarks: number;
  dueDate: string;
  status: 'active' | 'closed';
  allowedFileTypes: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  targetId: string; // quizId or homeworkId
  targetType: 'quiz' | 'homework';
  targetTitle: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers?: Record<string, string>; // questionId -> answer
  fileUrl?: string;
  fileName?: string;
  content?: string;
  marksObtained?: number;
  maxMarks: number;
  status: 'submitted' | 'graded' | 'late';
  feedback?: string;
  evaluatedAt?: string;
  integrityFlags?: string[];
}

export interface Doubt {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  message: string;
  status: 'unanswered' | 'answered';
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  isHandRaised: boolean;
  createdAt: string;
}

export interface StudentNote {
  id: string;
  studentId: string;
  classroomId?: string;
  classroomTitle?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  classroomId: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'ended';
  createdAt: string;
  votedUserIds?: Record<string, string>; // userId -> optionId
}

export type IntegrityEventType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'CAM_PERMISSION_DENIED'
  | 'RAPID_SUBMISSION'
  | 'SUSPICIOUS_SIMILARITY';

export interface IntegrityFlag {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  activityTitle: string;
  eventType: IntegrityEventType;
  severity: 'low' | 'medium' | 'high';
  details: string;
  timestamp: string;
  reviewed: boolean;
  teacherActionNote?: string;
  resolutionStatus?: 'pending' | 'cleared' | 'flagged_for_investigation';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface EndOfClassSummary {
  id: string;
  classroomId: string;
  classroomTitle: string;
  sessionDate: string;
  topicCovered: string;
  attendancePresent: number;
  attendanceTotal: number;
  attendanceRate: number;
  quizAverageScore: number;
  quizTotalSubmissions: number;
  unresolvedDoubtsCount: number;
  weakTopics: string[];
  assignedHomework: string[];
  recommendations: string[];
  aiOverview: string;
  generatedAt: string;
}
