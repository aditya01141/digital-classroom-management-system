import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  FolderGit2,
  HelpCircle,
  Radio,
  ArrowRight,
  Sparkles,
  Play,
  Square,
  Clock,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    classrooms,
    activeClassroom,
    toggleSessionState,
    updateCurrentTopic,
    attendance,
    submissions,
    doubts,
    quizzes,
    flags,
  } = useClassroom();

  const [topicInput, setTopicInput] = useState(activeClassroom?.currentTopic || '');
  const [isEditingTopic, setIsEditingTopic] = useState(false);

  const totalStudents = classrooms.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const activeClassroomsCount = classrooms.filter((c) => c.activeSession).length;
  const todayAttendance = attendance.filter((a) => a.classroomId === activeClassroom?.id);
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0;
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted');
  const unansweredDoubts = doubts.filter((d) => d.status === 'unanswered');
  const activeQuizzes = quizzes.filter((q) => q.status === 'published');
  const unreviewedFlags = flags.filter((f) => !f.reviewed);

  const handleTopicSave = () => {
    if (activeClassroom && topicInput.trim()) {
      updateCurrentTopic(activeClassroom.id, topicInput.trim());
      setIsEditingTopic(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Session Master Controller */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Instructor Dashboard
            </h1>
            <Badge variant="primary" size="sm">
              Academic Term 2026
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong>{user?.name}</strong> • {user?.designation} ({user?.department})
          </p>
        </div>

        {/* Live Session Hub Controls */}
        {activeClassroom && (
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-3 py-1">
              <span className="text-xs font-semibold text-slate-500">Live Session:</span>
              {activeClassroom.activeSession ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Broadcasting ({activeClassroom.code})
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-md">
                  Session Inactive
                </span>
              )}
            </div>

            <button
              onClick={() => toggleSessionState(activeClassroom.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                activeClassroom.activeSession
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {activeClassroom.activeSession ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>End Live Session</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Classroom Stream</span>
                </>
              )}
            </button>

            <Link
              to={`/classrooms/${activeClassroom.id}`}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Session Details →
            </Link>
          </div>
        )}
      </div>

      {/* Broadcasted Topic Bar */}
      {activeClassroom && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px]">
                Currently Visible Topic to Students:
              </span>
              {isEditingTopic ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-blue-300 rounded-lg bg-white text-slate-900 focus:outline-hidden"
                  />
                  <button
                    onClick={handleTopicSave}
                    className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingTopic(false)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="font-bold text-slate-900 text-sm">{activeClassroom.currentTopic}</p>
              )}
            </div>
          </div>
          {!isEditingTopic && (
            <button
              onClick={() => {
                setTopicInput(activeClassroom.currentTopic);
                setIsEditingTopic(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-white text-blue-700 font-bold border border-blue-200 hover:bg-blue-50 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              Change Broadcast Topic
            </button>
          )}
        </div>
      )}

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Enrolled Students"
          value={totalStudents}
          subtitle={`Across ${classrooms.length} Course Sections`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Today's Verified Attendance"
          value={`${attendanceRate}%`}
          subtitle={`${presentCount} of ${todayAttendance.length} students verified`}
          icon={CalendarCheck}
          color="emerald"
          trend={{ value: 'Hardware Verified', isPositive: true }}
        />
        <StatCard
          title="Pending Submissions"
          value={pendingSubmissions.length}
          subtitle="Waiting for teacher evaluation"
          icon={FolderGit2}
          color="amber"
          trend={{ value: 'Grading Required', isPositive: false }}
        />
        <StatCard
          title="Live Student Doubts"
          value={unansweredDoubts.length}
          subtitle="Open questions in queue"
          icon={HelpCircle}
          color="rose"
        />
      </div>

      {/* Main Grid: Pending Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Submissions to Grade & Doubts Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submissions awaiting grading */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Submissions Requiring Evaluation</h3>
              </div>
              <Link
                to="/teacher/homework"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All ({submissions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All student homework submissions have been evaluated!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                        <Badge variant="warning" size="sm">
                          Pending Review
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{sub.targetTitle}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Submitted at: {sub.submittedAt}</p>
                    </div>
                    <Link
                      to="/teacher/homework"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                    >
                      Grade Now
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unanswered Doubts Queue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Live Doubts & Questions</h3>
              </div>
              <Link
                to="/teacher/doubts"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Doubt Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {doubts.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    d.status === 'unanswered'
                      ? 'border-rose-200 bg-rose-50/30'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{d.studentName}</span>
                      {d.isHandRaised && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[10px] animate-pulse">
                          ✋ Hand Raised
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[10px]">{d.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{d.message}</p>
                  {d.status === 'answered' && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                      <strong className="text-blue-700">Your Response: </strong>
                      {d.response}
                    </div>
                  )}
                  {d.status === 'unanswered' && (
                    <div className="mt-3 flex justify-end">
                      <Link
                        to="/teacher/doubts"
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                      >
                        Reply to Question
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Integrity Flags & AI Summary Widget */}
        <div className="space-y-6">
          {/* AI End of class assistant */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-purple-800/60">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="text-base font-bold">AI End-of-Class Intelligence</h3>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed mb-4">
              Generate an instant, objective synthesized overview of today's attendance, average quiz comprehension,
              unanswered doubts, and weak conceptual topics.
            </p>
            <Link
              to="/teacher/summary"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Session Summary</span>
            </Link>
          </div>

          {/* Academic Integrity Alert Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Academic Integrity Feed</h3>
              </div>
              <Badge variant="purple" size="sm">
                {unreviewedFlags.length} Pending
              </Badge>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Consent-based tab and window blur detection during assessments. Flags require manual teacher review.
            </p>

            <div className="space-y-2.5">
              {flags.slice(0, 3).map((flg) => (
                <div
                  key={flg.id}
                  className={`p-3 rounded-xl border text-xs ${
                    flg.reviewed
                      ? 'border-slate-200 bg-slate-50/70 text-slate-500'
                      : 'border-purple-200 bg-purple-50/40 text-purple-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span>{flg.studentName}</span>
                    <span className="uppercase text-[10px] text-purple-700">{flg.eventType}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{flg.details}</p>
                </div>
              ))}
            </div>

            <Link
              to="/teacher/integrity"
              className="mt-4 block text-center text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Open Academic Integrity Review →
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                to="/teacher/materials"
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100 flex flex-col items-center text-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Upload Material</span>
              </Link>
              <Link
                to="/teacher/polls"
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100 flex flex-col items-center text-center gap-1.5"
              >
                <Radio className="w-4 h-4 text-indigo-600" />
                <span>Launch Poll</span>
              </Link>
              <Link
                to="/teacher/quizzes"
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100 flex flex-col items-center text-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Create Quiz</span>
              </Link>
              <Link
                to="/teacher/attendance"
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100 flex flex-col items-center text-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4 text-amber-600" />
                <span>Export Roster</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
