import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarCheck,
  FileCheck2,
  FolderGit2,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Radio,
  FileSignature,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { classrooms, activeClassroom, materials, quizzes, homeworks, submissions, notes, doubts } = useClassroom();

  const enrolledClassrooms = classrooms.filter((c) =>
    c.enrolledStudents?.includes(user?.id || 'usr_student_01')
  );

  const studentSubmissions = submissions.filter((s) => s.studentId === user?.id);
  const gradedQuizSubs = studentSubmissions.filter((s) => s.targetType === 'quiz' && s.marksObtained !== undefined);
  const avgQuizScore =
    gradedQuizSubs.length > 0
      ? Math.round(
          gradedQuizSubs.reduce((acc, s) => acc + (s.marksObtained || 0), 0) / gradedQuizSubs.length
        )
      : 20;

  const pendingHomework = homeworks.filter(
    (h) => h.status === 'active' && !studentSubmissions.some((s) => s.targetId === h.id)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Learning Hub</h1>
            <Badge variant="success" size="sm">
              Enrolled: {user?.rollNumber || 'CS23B1042'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome, <strong>{user?.name}</strong> • {user?.program} (Section {user?.section})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/student/join"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Join Class with Code</span>
          </Link>
          <Link
            to="/ai/workspace"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Study Tools</span>
          </Link>
        </div>
      </div>

      {/* Live Broadcast Notice */}
      {activeClassroom?.activeSession && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-blue-200">
                  Live Lecture Stream Active
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                {activeClassroom.title} ({activeClassroom.code})
              </h2>
              <p className="text-xs text-blue-100">Broadcasting: {activeClassroom.currentTopic}</p>
            </div>
          </div>
          <Link
            to={`/student/classrooms/${activeClassroom.id}`}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs transition-colors shrink-0 shadow-sm"
          >
            Enter Live Stream →
          </Link>
        </div>
      )}

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="My Enrolled Courses"
          value={enrolledClassrooms.length}
          subtitle="Active academic term"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Verified Attendance"
          value="100%"
          subtitle="All sessions validated"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Assessment Average"
          value={`${avgQuizScore} / 20`}
          subtitle="Across completed tests"
          icon={FileCheck2}
          color="purple"
        />
        <StatCard
          title="Pending Homework"
          value={pendingHomework.length}
          subtitle="Assignments due soon"
          icon={FolderGit2}
          color="amber"
        />
      </div>

      {/* Main Grid: Enrolled Classrooms & Pending Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Classrooms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">My Enrolled Classrooms</h3>
              </div>
              <Link to="/student/classrooms" className="text-xs font-bold text-blue-600">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledClassrooms.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      {c.activeSession && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{c.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    <p className="text-[11px] text-slate-400 mt-3">Instructor: {c.teacherName}</p>
                  </div>

                  <Link
                    to={`/student/classrooms/${c.id}`}
                    className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>Open Learning Stream</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks & Homework */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Active Homework & Assignments</h3>
              </div>
              <Link to="/student/homework" className="text-xs font-bold text-blue-600">
                All Homework →
              </Link>
            </div>

            <div className="space-y-3">
              {homeworks.slice(0, 2).map((hw) => {
                const sub = studentSubmissions.find((s) => s.targetId === hw.id);
                return (
                  <div
                    key={hw.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{hw.title}</span>
                        <Badge variant={sub ? (sub.status === 'graded' ? 'success' : 'primary') : 'warning'} size="sm">
                          {sub ? (sub.status === 'graded' ? 'Evaluated' : 'Submitted') : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Due: {hw.dueDate} • Max Marks: {hw.maxMarks}</p>
                      {sub?.marksObtained !== undefined && (
                        <p className="text-[11px] font-bold text-emerald-700 mt-1">
                          Score: {sub.marksObtained}/{sub.maxMarks} — "{sub.feedback}"
                        </p>
                      )}
                    </div>

                    <Link
                      to="/student/homework"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                    >
                      {sub ? 'View Feedback' : 'Submit Work'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Digital Notes & Doubts shortcuts */}
        <div className="space-y-6">
          {/* Quick Notes Access */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Personal Digital Notes</h3>
              </div>
              <Link to="/student/notes" className="text-xs font-bold text-blue-600">
                Notes Hub →
              </Link>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Persistent markdown notes saved across reloads and exportable to text.
            </p>

            <div className="space-y-2">
              {notes.slice(0, 2).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block truncate">{n.title}</span>
                  <p className="text-slate-500 text-[11px] truncate mt-0.5">{n.content}</p>
                </div>
              ))}
            </div>

            <Link
              to="/student/notes"
              className="mt-4 block text-center py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              + Create New Note
            </Link>
          </div>

          {/* AI Tutor Card */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-purple-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <h3 className="text-base font-bold">AI Learning Assistant</h3>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              Stuck on UML sequence fragments, ACID properties, or normal forms? Chat with the AI Tutor for instant step-by-step guidance.
            </p>
            <Link
              to="/ai/workspace"
              className="inline-flex items-center gap-2 w-full justify-center py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-colors"
            >
              <span>Ask AI Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
