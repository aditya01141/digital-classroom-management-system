import React, { createContext, useContext, useState, useEffect } from 'react';
import {
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
import { apiService } from '../services/apiService';
import { verificationService, DeviceVerificationResult } from '../services/verificationService';

interface ClassroomContextType {
  classrooms: Classroom[];
  activeClassroomId: string;
  setActiveClassroomId: (id: string) => void;
  activeClassroom: Classroom | undefined;
  materials: StudyMaterial[];
  attendance: AttendanceRecord[];
  quizzes: Quiz[];
  homeworks: Homework[];
  submissions: Submission[];
  doubts: Doubt[];
  notes: StudentNote[];
  polls: Poll[];
  flags: IntegrityFlag[];
  summaries: EndOfClassSummary[];
  
  // Classroom actions
  createClassroom: (title: string, subject: string, description: string, section: string, scheduledTime: string, teacherId: string, teacherName: string) => Classroom;
  joinClassroom: (code: string, studentId: string, studentName: string, rollNumber: string) => Promise<{ success: boolean; message: string; verification?: DeviceVerificationResult }>;
  toggleSessionState: (classroomId: string) => void;
  updateCurrentTopic: (classroomId: string, topic: string) => void;

  // Material actions
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'completedByStudentIds'>) => StudyMaterial;
  togglePublishMaterial: (id: string) => void;
  markMaterialComplete: (materialId: string, studentId: string) => void;

  // Attendance actions
  markManualAttendance: (classroomId: string, studentId: string, studentName: string, rollNumber: string, status: 'present' | 'absent' | 'late') => void;
  exportAttendanceCSV: (classroomId?: string) => void;

  // Assessment & Quiz actions
  createQuiz: (quizData: Omit<Quiz, 'id' | 'createdAt'>) => Quiz;
  submitQuiz: (quizId: string, classroomId: string, studentId: string, studentName: string, answers: Record<string, string>, integrityNotes?: string[]) => Submission;

  // Homework actions
  createHomework: (hwData: Omit<Homework, 'id' | 'createdAt'>) => Homework;
  submitHomework: (homeworkId: string, classroomId: string, studentId: string, studentName: string, content: string, fileName?: string) => Submission;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;

  // Doubt actions
  raiseDoubt: (classroomId: string, studentId: string, studentName: string, message: string, isHandRaised?: boolean) => void;
  answerDoubt: (doubtId: string, response: string, teacherName: string) => void;
  toggleRaiseHand: (studentId: string, studentName: string, classroomId: string) => void;

  // Notes actions
  saveNote: (note: Omit<StudentNote, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  deleteNote: (id: string) => void;

  // Poll actions
  createPoll: (classroomId: string, question: string, options: string[]) => void;
  votePoll: (pollId: string, optionId: string, userId: string) => void;

  // Integrity actions
  logIntegrityEvent: (flag: Omit<IntegrityFlag, 'id' | 'timestamp' | 'reviewed'>) => void;
  reviewFlag: (flagId: string, status: 'cleared' | 'flagged_for_investigation', notes: string) => void;

  // Summary actions
  saveSummary: (summary: EndOfClassSummary) => void;
  resetAllDemoData: () => void;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => apiService.getClassrooms());
  const [activeClassroomId, setActiveClassroomId] = useState<string>('cls_se_301');
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => apiService.getMaterials());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => apiService.getAttendance());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => apiService.getQuizzes());
  const [homeworks, setHomeworks] = useState<Homework[]>(() => apiService.getHomeworks());
  const [submissions, setSubmissions] = useState<Submission[]>(() => apiService.getSubmissions());
  const [doubts, setDoubts] = useState<Doubt[]>(() => apiService.getDoubts());
  const [notes, setNotes] = useState<StudentNote[]>(() => apiService.getNotes());
  const [polls, setPolls] = useState<Poll[]>(() => apiService.getPolls());
  const [flags, setFlags] = useState<IntegrityFlag[]>(() => apiService.getFlags());
  const [summaries, setSummaries] = useState<EndOfClassSummary[]>(() => apiService.getSummaries());

  const activeClassroom = classrooms.find((c) => c.id === activeClassroomId) || classrooms[0];

  // Sync state helpers
  const createClassroom = (
    title: string,
    subject: string,
    description: string,
    section: string,
    scheduledTime: string,
    teacherId: string,
    teacherName: string
  ): Classroom => {
    // Generate clean code like CS-501 or SE-2026
    const prefix = subject.slice(0, 3).toUpperCase();
    const code = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    const newCls = apiService.createClassroom({
      title,
      subject,
      description,
      section,
      code,
      teacherId,
      teacherName,
      scheduledTime,
      activeSession: true,
      currentTopic: 'Orientation & Module Introduction',
    });
    setClassrooms(apiService.getClassrooms());
    setActiveClassroomId(newCls.id);
    return newCls;
  };

  const joinClassroom = async (
    code: string,
    studentId: string,
    studentName: string,
    rollNumber: string
  ): Promise<{ success: boolean; message: string; verification?: DeviceVerificationResult }> => {
    // Execute Device Verification as per SRS & Sequence Diagram (Step 8-9)
    const verification = await verificationService.verifyStudentDevice(studentId, rollNumber);
    if (!verification.isValid) {
      return { success: false, message: 'Identity / Device Verification failed. Access denied.' };
    }

    const res = apiService.joinClassroom(code, studentId);
    if (res.success && res.classroom) {
      // Record attendance automatically as per Sequence Diagram
      const today = new Date().toISOString().split('T')[0];
      apiService.recordAttendance({
        classroomId: res.classroom.id,
        studentId,
        studentName,
        rollNumber,
        date: today,
        status: 'present',
        verified: true,
        verificationMethod: 'Device Fingerprint',
        deviceFingerprint: verification.deviceId,
      });

      setClassrooms(apiService.getClassrooms());
      setAttendance(apiService.getAttendance());
      setActiveClassroomId(res.classroom.id);
      return { success: true, message: res.message, verification };
    }

    return { success: false, message: res.message };
  };

  const toggleSessionState = (classroomId: string) => {
    const updated = classrooms.map((c) => (c.id === classroomId ? { ...c, activeSession: !c.activeSession } : c));
    setClassrooms(updated);
    apiService.saveClassrooms(updated);
  };

  const updateCurrentTopic = (classroomId: string, topic: string) => {
    const updated = classrooms.map((c) => (c.id === classroomId ? { ...c, currentTopic: topic } : c));
    setClassrooms(updated);
    apiService.saveClassrooms(updated);
  };

  const addMaterial = (matData: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'completedByStudentIds'>): StudyMaterial => {
    const newMat = apiService.addMaterial(matData);
    setMaterials(apiService.getMaterials());
    return newMat;
  };

  const togglePublishMaterial = (id: string) => {
    const updated = materials.map((m) => (m.id === id ? { ...m, isPublished: !m.isPublished } : m));
    setMaterials(updated);
    apiService.saveMaterials(updated);
  };

  const markMaterialComplete = (materialId: string, studentId: string) => {
    const updated = materials.map((m) => {
      if (m.id === materialId) {
        const completed = m.completedByStudentIds || [];
        if (!completed.includes(studentId)) {
          return { ...m, completedByStudentIds: [...completed, studentId] };
        }
      }
      return m;
    });
    setMaterials(updated);
    apiService.saveMaterials(updated);
  };

  const markManualAttendance = (
    classroomId: string,
    studentId: string,
    studentName: string,
    rollNumber: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(
      (a) => a.classroomId === classroomId && a.studentId === studentId && a.date === today
    );

    let updated: AttendanceRecord[];
    if (existing) {
      updated = attendance.map((a) => (a.id === existing.id ? { ...a, status } : a));
    } else {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newRec: AttendanceRecord = {
        id: `att_${Date.now().toString(36)}`,
        classroomId,
        studentId,
        studentName,
        rollNumber,
        date: today,
        status,
        verified: true,
        verificationMethod: 'Manual Teacher Mark',
        deviceFingerprint: 'MANUAL_VERIFIED',
        timestamp: time,
      };
      updated = [newRec, ...attendance];
    }
    setAttendance(updated);
    apiService.saveAttendance(updated);
  };

  const exportAttendanceCSV = (targetClassroomId?: string) => {
    const records = targetClassroomId
      ? attendance.filter((a) => a.classroomId === targetClassroomId)
      : attendance;

    const headers = ['Attendance ID', 'Classroom ID', 'Student Name', 'Roll Number', 'Date', 'Time', 'Status', 'Verified', 'Method', 'Device Fingerprint'];
    const rows = records.map((r) => [
      r.id,
      r.classroomId,
      `"${r.studentName}"`,
      r.rollNumber,
      r.date,
      r.timestamp,
      r.status.toUpperCase(),
      r.verified ? 'YES' : 'NO',
      `"${r.verificationMethod}"`,
      r.deviceFingerprint,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dcms_attendance_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>): Quiz => {
    const newQuiz = apiService.addQuiz(quizData);
    setQuizzes(apiService.getQuizzes());
    return newQuiz;
  };

  const submitQuiz = (
    quizId: string,
    classroomId: string,
    studentId: string,
    studentName: string,
    answers: Record<string, string>,
    integrityNotes?: string[]
  ): Submission => {
    const quiz = quizzes.find((q) => q.id === quizId);
    let calculatedMarks = 0;
    let maxMarks = quiz?.maxMarks || 20;

    if (quiz) {
      quiz.questions.forEach((q) => {
        if (answers[q.id] && answers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
          calculatedMarks += q.marks;
        }
      });
    }

    const sub = apiService.submitWork({
      targetId: quizId,
      targetType: 'quiz',
      targetTitle: quiz?.title || 'Class Quiz',
      classroomId,
      studentId,
      studentName,
      answers,
      marksObtained: calculatedMarks,
      maxMarks,
      status: 'graded',
      feedback: `Automated assessment: ${calculatedMarks}/${maxMarks} correct.`,
      evaluatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      integrityFlags: integrityNotes || [],
    });

    setSubmissions(apiService.getSubmissions());
    return sub;
  };

  const createHomework = (hwData: Omit<Homework, 'id' | 'createdAt'>): Homework => {
    const newHw = apiService.addHomework(hwData);
    setHomeworks(apiService.getHomeworks());
    return newHw;
  };

  const submitHomework = (
    homeworkId: string,
    classroomId: string,
    studentId: string,
    studentName: string,
    content: string,
    fileName?: string
  ): Submission => {
    const hw = homeworks.find((h) => h.id === homeworkId);
    const sub = apiService.submitWork({
      targetId: homeworkId,
      targetType: 'homework',
      targetTitle: hw?.title || 'Assignment Submission',
      classroomId,
      studentId,
      studentName,
      content,
      fileName: fileName || `${studentName.replace(/\s+/g, '_')}_Submission.pdf`,
      fileUrl: 'https://example.com/uploads/student_doc.pdf',
      maxMarks: hw?.maxMarks || 50,
      status: 'submitted',
    });
    setSubmissions(apiService.getSubmissions());
    return sub;
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    apiService.gradeSubmission(submissionId, marks, feedback);
    setSubmissions(apiService.getSubmissions());
  };

  const raiseDoubt = (classroomId: string, studentId: string, studentName: string, message: string, isHandRaised = false) => {
    apiService.raiseDoubt({ classroomId, studentId, studentName, message, isHandRaised });
    setDoubts(apiService.getDoubts());
  };

  const answerDoubt = (doubtId: string, response: string, teacherName: string) => {
    apiService.answerDoubt(doubtId, response, teacherName);
    setDoubts(apiService.getDoubts());
  };

  const toggleRaiseHand = (studentId: string, studentName: string, classroomId: string) => {
    const existing = doubts.find((d) => d.studentId === studentId && d.classroomId === classroomId && d.isHandRaised);
    if (existing) {
      const updated = doubts.map((d) => (d.id === existing.id ? { ...d, isHandRaised: false } : d));
      setDoubts(updated);
      apiService.saveDoubts(updated);
    } else {
      apiService.raiseDoubt({
        classroomId,
        studentId,
        studentName,
        message: 'Student digitally raised hand to ask a question during live session.',
        isHandRaised: true,
      });
      setDoubts(apiService.getDoubts());
    }
  };

  const saveNote = (noteData: Omit<StudentNote, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    let updated: StudentNote[];
    if (existingId) {
      updated = notes.map((n) => (n.id === existingId ? { ...n, ...noteData, updatedAt: now } : n));
    } else {
      const newNote: StudentNote = {
        ...noteData,
        id: `not_${Date.now().toString(36)}`,
        createdAt: now,
        updatedAt: now,
      };
      updated = [newNote, ...notes];
    }
    setNotes(updated);
    apiService.saveNotes(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    apiService.saveNotes(updated);
  };

  const createPoll = (classroomId: string, question: string, optionTexts: string[]) => {
    const newPoll: Poll = {
      id: `pol_${Date.now().toString(36)}`,
      classroomId,
      question,
      options: optionTexts.map((txt, idx) => ({ id: `opt_${idx + 1}`, text: txt, votes: 0 })),
      totalVotes: 0,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      votedUserIds: {},
    };
    const updated = [newPoll, ...polls];
    setPolls(updated);
    apiService.savePolls(updated);
  };

  const votePoll = (pollId: string, optionId: string, userId: string) => {
    const updated = polls.map((p) => {
      if (p.id === pollId) {
        const votedMap = p.votedUserIds || {};
        if (votedMap[userId]) return p; // already voted
        const newOptions = p.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt));
        return {
          ...p,
          options: newOptions,
          totalVotes: p.totalVotes + 1,
          votedUserIds: { ...votedMap, [userId]: optionId },
        };
      }
      return p;
    });
    setPolls(updated);
    apiService.savePolls(updated);
  };

  const logIntegrityEvent = (flagData: Omit<IntegrityFlag, 'id' | 'timestamp' | 'reviewed'>) => {
    const newFlag: IntegrityFlag = {
      ...flagData,
      id: `flg_${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      reviewed: false,
      resolutionStatus: 'pending',
    };
    const updated = [newFlag, ...flags];
    setFlags(updated);
    apiService.saveFlags(updated);
  };

  const reviewFlag = (flagId: string, status: 'cleared' | 'flagged_for_investigation', notesText: string) => {
    const updated = flags.map((f) =>
      f.id === flagId
        ? {
            ...f,
            reviewed: true,
            resolutionStatus: status,
            teacherActionNote: notesText,
          }
        : f
    );
    setFlags(updated);
    apiService.saveFlags(updated);
  };

  const saveSummary = (summary: EndOfClassSummary) => {
    const updated = [summary, ...summaries];
    setSummaries(updated);
    apiService.saveSummaries(updated);
  };

  const resetAllDemoData = () => {
    apiService.resetToDemoDefaults();
    setClassrooms(apiService.getClassrooms());
    setMaterials(apiService.getMaterials());
    setAttendance(apiService.getAttendance());
    setQuizzes(apiService.getQuizzes());
    setHomeworks(apiService.getHomeworks());
    setSubmissions(apiService.getSubmissions());
    setDoubts(apiService.getDoubts());
    setNotes(apiService.getNotes());
    setPolls(apiService.getPolls());
    setFlags(apiService.getFlags());
    setSummaries(apiService.getSummaries());
  };

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        activeClassroomId,
        setActiveClassroomId,
        activeClassroom,
        materials,
        attendance,
        quizzes,
        homeworks,
        submissions,
        doubts,
        notes,
        polls,
        flags,
        summaries,
        createClassroom,
        joinClassroom,
        toggleSessionState,
        updateCurrentTopic,
        addMaterial,
        togglePublishMaterial,
        markMaterialComplete,
        markManualAttendance,
        exportAttendanceCSV,
        createQuiz,
        submitQuiz,
        createHomework,
        submitHomework,
        gradeSubmission,
        raiseDoubt,
        answerDoubt,
        toggleRaiseHand,
        saveNote,
        deleteNote,
        createPoll,
        votePoll,
        logIntegrityEvent,
        reviewFlag,
        saveSummary,
        resetAllDemoData,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = (): ClassroomContextType => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within a ClassroomProvider');
  }
  return context;
};
