import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClassroomProvider } from './context/ClassroomContext';
import { AppLayout } from './components/layout/AppLayout';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClassrooms } from './pages/teacher/TeacherClassrooms';
import { ClassroomSessionPage } from './pages/teacher/ClassroomSessionPage';
import { TeacherMaterials } from './pages/teacher/TeacherMaterials';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherPolls } from './pages/teacher/TeacherPolls';
import { TeacherQuizzes } from './pages/teacher/TeacherQuizzes';
import { TeacherHomework } from './pages/teacher/TeacherHomework';
import { TeacherDoubts } from './pages/teacher/TeacherDoubts';
import { TeacherIntegrity } from './pages/teacher/TeacherIntegrity';
import { EndOfClassSummaryPage } from './pages/teacher/EndOfClassSummaryPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentClassrooms } from './pages/student/StudentClassrooms';
import { StudentJoinClass } from './pages/student/StudentJoinClass';
import { StudentClassroomView } from './pages/student/StudentClassroomView';
import { StudentMaterials } from './pages/student/StudentMaterials';
import { StudentQuizzes } from './pages/student/StudentQuizzes';
import { TakeQuizPage } from './pages/student/TakeQuizPage';
import { StudentHomework } from './pages/student/StudentHomework';
import { StudentNotes } from './pages/student/StudentNotes';
import { StudentDoubts } from './pages/student/StudentDoubts';
import { StudentProgress } from './pages/student/StudentProgress';

// AI & Common Pages
import { AIWorkspace } from './pages/ai/AIWorkspace';
import { AnalyticsPage } from './pages/common/AnalyticsPage';
import { ProfileSettingsPage } from './pages/common/ProfileSettingsPage';
import { NotFoundPage } from './pages/common/NotFoundPage';

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ClassroomProvider>
          <Routes>
            {/* Public Landing & Authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Layout */}
            <Route element={<AppLayout />}>
              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/classrooms" element={<TeacherClassrooms />} />
              <Route path="/classrooms/:id" element={<ClassroomSessionPage />} />
              <Route path="/teacher/materials" element={<TeacherMaterials />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/polls" element={<TeacherPolls />} />
              <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
              <Route path="/teacher/homework" element={<TeacherHomework />} />
              <Route path="/teacher/doubts" element={<TeacherDoubts />} />
              <Route path="/teacher/integrity" element={<TeacherIntegrity />} />
              <Route path="/teacher/summary" element={<EndOfClassSummaryPage />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/classrooms" element={<StudentClassrooms />} />
              <Route path="/student/classrooms/:id" element={<StudentClassroomView />} />
              <Route path="/student/join" element={<StudentJoinClass />} />
              <Route path="/student/materials" element={<StudentMaterials />} />
              <Route path="/student/quizzes" element={<StudentQuizzes />} />
              <Route path="/student/quizzes/:id" element={<TakeQuizPage />} />
              <Route path="/student/homework" element={<StudentHomework />} />
              <Route path="/student/notes" element={<StudentNotes />} />
              <Route path="/student/doubts" element={<StudentDoubts />} />
              <Route path="/student/progress" element={<StudentProgress />} />

              {/* Shared AI Workspace & Deep-links */}
              <Route path="/ai/workspace" element={<AIWorkspace />} />
              <Route path="/ai/study-assistant" element={<AIWorkspace />} />
              <Route path="/ai/summarizer" element={<AIWorkspace />} />
              <Route path="/ai/quiz-generator" element={<AIWorkspace />} />
              <Route path="/ai/flashcards" element={<AIWorkspace />} />

              {/* Shared Performance & Settings */}
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfileSettingsPage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ClassroomProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
