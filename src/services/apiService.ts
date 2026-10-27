import {
  User,
  Classroom,
  StudyMaterial,
  AttendanceRecord,
  Quiz,
  Homework,
  Submission,
  Doubt,
  StudentNote,
  Poll,
  IntegrityFlag,
  EndOfClassSummary,
} from '../types';
import {
  INITIAL_TEACHER,
  INITIAL_STUDENT,
  INITIAL_CLASSROOMS,
  INITIAL_MATERIALS,
  INITIAL_ATTENDANCE,
  INITIAL_QUIZZES,
  INITIAL_HOMEWORKS,
  INITIAL_SUBMISSIONS,
  INITIAL_DOUBTS,
  INITIAL_NOTES,
  INITIAL_POLLS,
  INITIAL_INTEGRITY_FLAGS,
  INITIAL_SUMMARIES,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'dcms_current_user',
  CLASSROOMS: 'dcms_classrooms',
  MATERIALS: 'dcms_materials',
  ATTENDANCE: 'dcms_attendance',
  QUIZZES: 'dcms_quizzes',
  HOMEWORKS: 'dcms_homeworks',
  SUBMISSIONS: 'dcms_submissions',
  DOUBTS: 'dcms_doubts',
  NOTES: 'dcms_notes',
  POLLS: 'dcms_polls',
  FLAGS: 'dcms_flags',
  SUMMARIES: 'dcms_summaries',
};

function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const apiService = {
  // Initialization & Reset
  resetToDemoDefaults(): void {
    setStorage(STORAGE_KEYS.CLASSROOMS, INITIAL_CLASSROOMS);
    setStorage(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    setStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    setStorage(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    setStorage(STORAGE_KEYS.HOMEWORKS, INITIAL_HOMEWORKS);
    setStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    setStorage(STORAGE_KEYS.DOUBTS, INITIAL_DOUBTS);
    setStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    setStorage(STORAGE_KEYS.POLLS, INITIAL_POLLS);
    setStorage(STORAGE_KEYS.FLAGS, INITIAL_INTEGRITY_FLAGS);
    setStorage(STORAGE_KEYS.SUMMARIES, INITIAL_SUMMARIES);
  },

  // Auth
  getCurrentUser(): User | null {
    return getStorage<User | null>(STORAGE_KEYS.USER, INITIAL_TEACHER);
  },
  setCurrentUser(user: User | null): void {
    setStorage(STORAGE_KEYS.USER, user);
  },

  // Classrooms
  getClassrooms(): Classroom[] {
    return getStorage<Classroom[]>(STORAGE_KEYS.CLASSROOMS, INITIAL_CLASSROOMS);
  },
  saveClassrooms(classrooms: Classroom[]): void {
    setStorage(STORAGE_KEYS.CLASSROOMS, classrooms);
  },
  createClassroom(classroomData: Omit<Classroom, 'id' | 'createdAt' | 'studentCount'>): Classroom {
    const classrooms = this.getClassrooms();
    const newClassroom: Classroom = {
      ...classroomData,
      id: `cls_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
      studentCount: 1,
      enrolledStudents: ['usr_student_01'],
    };
    classrooms.unshift(newClassroom);
    this.saveClassrooms(classrooms);
    return newClassroom;
  },
  joinClassroom(code: string, studentId: string): { success: boolean; classroom?: Classroom; message: string } {
    const classrooms = this.getClassrooms();
    const match = classrooms.find((c) => c.code.trim().toUpperCase() === code.trim().toUpperCase());
    if (!match) {
      return { success: false, message: 'Invalid classroom code. Please verify with your course instructor.' };
    }
    if (!match.enrolledStudents) {
      match.enrolledStudents = [];
    }
    if (!match.enrolledStudents.includes(studentId)) {
      match.enrolledStudents.push(studentId);
      match.studentCount = match.enrolledStudents.length;
      this.saveClassrooms(classrooms);
    }
    return { success: true, classroom: match, message: `Successfully enrolled in ${match.title}!` };
  },

  // Materials
  getMaterials(): StudyMaterial[] {
    return getStorage<StudyMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  },
  saveMaterials(materials: StudyMaterial[]): void {
    setStorage(STORAGE_KEYS.MATERIALS, materials);
  },
  addMaterial(matData: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'completedByStudentIds'>): StudyMaterial {
    const materials = this.getMaterials();
    const newMat: StudyMaterial = {
      ...matData,
      id: `mat_${Date.now().toString(36)}`,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      completedByStudentIds: [],
    };
    materials.unshift(newMat);
    this.saveMaterials(materials);
    return newMat;
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return getStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },
  saveAttendance(attendance: AttendanceRecord[]): void {
    setStorage(STORAGE_KEYS.ATTENDANCE, attendance);
  },
  recordAttendance(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): AttendanceRecord {
    const attendance = this.getAttendance();
    const existingIndex = attendance.findIndex(
      (a) => a.classroomId === record.classroomId && a.studentId === record.studentId && a.date === record.date
    );
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (existingIndex >= 0) {
      // Idempotent: don't duplicate attendance for same student on same day
      return attendance[existingIndex];
    }

    const newRecord: AttendanceRecord = {
      ...record,
      id: `att_${Date.now().toString(36)}`,
      timestamp: time,
    };
    attendance.unshift(newRecord);
    this.saveAttendance(attendance);
    return newRecord;
  },

  // Quizzes
  getQuizzes(): Quiz[] {
    return getStorage<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  },
  saveQuizzes(quizzes: Quiz[]): void {
    setStorage(STORAGE_KEYS.QUIZZES, quizzes);
  },
  addQuiz(quizData: Omit<Quiz, 'id' | 'createdAt'>): Quiz {
    const quizzes = this.getQuizzes();
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    quizzes.unshift(newQuiz);
    this.saveQuizzes(quizzes);
    return newQuiz;
  },

  // Homeworks
  getHomeworks(): Homework[] {
    return getStorage<Homework[]>(STORAGE_KEYS.HOMEWORKS, INITIAL_HOMEWORKS);
  },
  saveHomeworks(homeworks: Homework[]): void {
    setStorage(STORAGE_KEYS.HOMEWORKS, homeworks);
  },
  addHomework(hwData: Omit<Homework, 'id' | 'createdAt'>): Homework {
    const homeworks = this.getHomeworks();
    const newHw: Homework = {
      ...hwData,
      id: `hw_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    homeworks.unshift(newHw);
    this.saveHomeworks(homeworks);
    return newHw;
  },

  // Submissions
  getSubmissions(): Submission[] {
    return getStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  },
  saveSubmissions(submissions: Submission[]): void {
    setStorage(STORAGE_KEYS.SUBMISSIONS, submissions);
  },
  submitWork(subData: Omit<Submission, 'id' | 'submittedAt'>): Submission {
    const submissions = this.getSubmissions();
    const newSub: Submission = {
      ...subData,
      id: `sub_${Date.now().toString(36)}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    submissions.unshift(newSub);
    this.saveSubmissions(submissions);
    return newSub;
  },
  gradeSubmission(submissionId: string, marks: number, feedback: string): Submission | null {
    const submissions = this.getSubmissions();
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return null;
    sub.marksObtained = marks;
    sub.feedback = feedback;
    sub.status = 'graded';
    sub.evaluatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.saveSubmissions(submissions);
    return sub;
  },

  // Doubts & Raise Hand
  getDoubts(): Doubt[] {
    return getStorage<Doubt[]>(STORAGE_KEYS.DOUBTS, INITIAL_DOUBTS);
  },
  saveDoubts(doubts: Doubt[]): void {
    setStorage(STORAGE_KEYS.DOUBTS, doubts);
  },
  raiseDoubt(data: Omit<Doubt, 'id' | 'createdAt' | 'status'>): Doubt {
    const doubts = this.getDoubts();
    const newDoubt: Doubt = {
      ...data,
      id: `dbt_${Date.now().toString(36)}`,
      status: 'unanswered',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    doubts.unshift(newDoubt);
    this.saveDoubts(doubts);
    return newDoubt;
  },
  answerDoubt(doubtId: string, response: string, responderName: string): Doubt | null {
    const doubts = this.getDoubts();
    const dbt = doubts.find((d) => d.id === doubtId);
    if (!dbt) return null;
    dbt.status = 'answered';
    dbt.response = response;
    dbt.respondedBy = responderName;
    dbt.respondedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    dbt.isHandRaised = false;
    this.saveDoubts(doubts);
    return dbt;
  },

  // Notes
  getNotes(): StudentNote[] {
    return getStorage<StudentNote[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  },
  saveNotes(notes: StudentNote[]): void {
    setStorage(STORAGE_KEYS.NOTES, notes);
  },

  // Polls
  getPolls(): Poll[] {
    return getStorage<Poll[]>(STORAGE_KEYS.POLLS, INITIAL_POLLS);
  },
  savePolls(polls: Poll[]): void {
    setStorage(STORAGE_KEYS.POLLS, polls);
  },

  // Integrity Flags
  getFlags(): IntegrityFlag[] {
    return getStorage<IntegrityFlag[]>(STORAGE_KEYS.FLAGS, INITIAL_INTEGRITY_FLAGS);
  },
  saveFlags(flags: IntegrityFlag[]): void {
    setStorage(STORAGE_KEYS.FLAGS, flags);
  },

  // Summaries
  getSummaries(): EndOfClassSummary[] {
    return getStorage<EndOfClassSummary[]>(STORAGE_KEYS.SUMMARIES, INITIAL_SUMMARIES);
  },
  saveSummaries(summaries: EndOfClassSummary[]): void {
    setStorage(STORAGE_KEYS.SUMMARIES, summaries);
  },
};
