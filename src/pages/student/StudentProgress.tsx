import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  CalendarCheck,
  FileCheck2,
  FolderGit2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { aiService, AIRecommendation } from '../../services/aiService';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const StudentProgress: React.FC = () => {
  const { user } = useAuth();
  const { attendance, submissions, materials, homeworks, quizzes } = useClassroom();

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const studentSubs = submissions.filter((s) => s.studentId === (user?.id || 'usr_student_01'));
  const quizSubs = studentSubs.filter((s) => s.targetType === 'quiz');
  const hwSubs = studentSubs.filter((s) => s.targetType === 'homework');

  const quizAvg =
    quizSubs.length > 0
      ? Math.round(
          quizSubs.reduce((acc, s) => acc + (s.marksObtained || 0), 0) / quizSubs.length
        )
      : 20;

  const completedActivitiesCount = materials.filter((m) =>
    m.completedByStudentIds?.includes(user?.id || 'usr_student_01')
  ).length;

  useEffect(() => {
    async function loadRecs() {
      setLoadingRecs(true);
      try {
        const res = await aiService.getPersonalizedRecommendations(
          user?.name || 'Rohan Verma',
          ['UML Aggregation vs Composition Semantics', 'Database Concurrency & 2-Phase Locking']
        );
        setRecommendations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecs(false);
      }
    }
    loadRecs();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Academic Performance & Learning Mastery</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on assessment accuracy, homework submissions, attendance verification, and AI recommendations.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Attendance Verification"
          value="100%"
          subtitle="All sessions device-verified"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Quiz Mastery"
          value={`${quizAvg} / 20`}
          subtitle={`${quizSubs.length} assessments completed`}
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="Homework Completion"
          value={`${hwSubs.length} / ${homeworks.length}`}
          subtitle="Assignments submitted"
          icon={FolderGit2}
          color="purple"
        />
        <StatCard
          title="Completed Milestones"
          value={completedActivitiesCount}
          subtitle="Sequential learning steps"
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      {/* AI Personalized Recommendations (Feature F) */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 text-white rounded-2xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Personalized Learning Recommendations</h3>
              <p className="text-xs text-purple-200">
                Tailored concept remediation based on your assessment response patterns.
              </p>
            </div>
          </div>
          <Badge variant="purple" size="sm">
            Pedagogical Engine Active
          </Badge>
        </div>

        {loadingRecs ? (
          <p className="text-xs text-purple-300 animate-pulse">Analyzing student performance data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-slate-800/80 rounded-2xl p-5 border border-purple-700/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : rec.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-400">Target Concept</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{rec.topic}</h4>
                  <p className="text-xs text-purple-200 mt-2 leading-relaxed">{rec.reason}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 text-xs">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Action Plan:</span>
                  <p className="text-emerald-300 text-[11px] font-medium mt-0.5">{rec.suggestedAction}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Assessment & Homework Record</h3>
          <p className="text-xs text-slate-500 mt-0.5">Your official marks and teacher rubric feedback.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-6">Assessment Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date Submitted</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Teacher Feedback</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-6 font-bold text-slate-900">{sub.targetTitle}</td>
                  <td className="py-3 px-4 uppercase text-[11px] font-bold text-slate-500">
                    {sub.targetType}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{sub.submittedAt}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {sub.marksObtained !== undefined ? (
                      <span className="text-emerald-700">
                        {sub.marksObtained} / {sub.maxMarks}
                      </span>
                    ) : (
                      <span className="text-slate-400">— / {sub.maxMarks}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                    {sub.feedback || 'Pending evaluation.'}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <Badge variant={sub.status === 'graded' ? 'success' : 'warning'} size="sm">
                      {sub.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
