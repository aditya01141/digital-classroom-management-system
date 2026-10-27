import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Award,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { aiService } from '../../services/aiService';
import { EndOfClassSummary } from '../../types';
import { AIModeBadge } from '../../components/common/AIModeBadge';
import { Badge } from '../../components/common/Badge';

export const EndOfClassSummaryPage: React.FC = () => {
  const {
    activeClassroom,
    attendance,
    submissions,
    doubts,
    homeworks,
    summaries,
    saveSummary,
  } = useClassroom();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'archive'>('generate');

  // Metrics for active classroom
  const today = new Date().toISOString().split('T')[0];
  const classAttendance = attendance.filter((a) => a.classroomId === activeClassroom?.id);
  const presentCount = classAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = classAttendance.length > 0 ? Math.round((presentCount / classAttendance.length) * 100) : 88;

  const quizSubs = submissions.filter(
    (s) => s.targetType === 'quiz' && s.classroomId === activeClassroom?.id
  );
  const quizAvg =
    quizSubs.length > 0
      ? Math.round(quizSubs.reduce((acc, s) => acc + (s.marksObtained || 0), 0) / quizSubs.length)
      : 18;

  const openDoubts = doubts.filter(
    (d) => d.classroomId === activeClassroom?.id && d.status === 'unanswered'
  ).length;

  const [currentSummary, setCurrentSummary] = useState<EndOfClassSummary>(summaries[0] || {
    id: 'sum_active',
    classroomId: activeClassroom?.id || 'cls_se_301',
    classroomTitle: activeClassroom?.title || 'Advanced Software Engineering',
    sessionDate: today,
    topicCovered: activeClassroom?.currentTopic || 'UML Modeling & Architecture',
    attendancePresent: presentCount || 7,
    attendanceTotal: classAttendance.length || 8,
    attendanceRate,
    quizAverageScore: quizAvg,
    quizTotalSubmissions: quizSubs.length || 5,
    unresolvedDoubtsCount: openDoubts,
    weakTopics: ['Aggregation vs Composition Semantics', 'Dependency Inversion Boundaries'],
    assignedHomework: ['Assignment 1: Complete UML Diagram Suite for DCMS'],
    recommendations: [
      'Conduct a 10-minute recap on UML Diamond notation at the start of next lecture.',
      'Provide supplementary visual flashcards for SOLID design principles.',
      'Schedule doubt resolution session for open questions by Aarjav Jain and Devansh Jain.',
    ],
    aiOverview: 'The session demonstrated high engagement with 87.5% verified attendance. The interactive poll on architecture had 38 votes favoring a Modular Monolith. Quiz results reflect strong comprehension in sequence flows, but 3 students showed confusion between aggregation and composition.',
    generatedAt: new Date().toLocaleTimeString(),
  });

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await aiService.generateEndOfClassSummary({
        className: activeClassroom?.title || 'Advanced Software Engineering',
        topic: activeClassroom?.currentTopic || 'UML Behavioral & Structural Modeling',
        attendancePresent: presentCount || 7,
        attendanceTotal: classAttendance.length || 8,
        quizAvg,
        openDoubts,
      });

      const newSum: EndOfClassSummary = {
        id: `sum_${Date.now().toString(36)}`,
        classroomId: activeClassroom?.id || 'cls_se_301',
        classroomTitle: activeClassroom?.title || 'Advanced Software Engineering',
        sessionDate: today,
        topicCovered: activeClassroom?.currentTopic || 'UML Behavioral & Structural Modeling',
        attendancePresent: presentCount || 7,
        attendanceTotal: classAttendance.length || 8,
        attendanceRate,
        quizAverageScore: quizAvg,
        quizTotalSubmissions: quizSubs.length || 5,
        unresolvedDoubtsCount: openDoubts,
        weakTopics: res.data.weakAreas,
        assignedHomework: homeworks.filter((h) => h.status === 'active').map((h) => h.title),
        recommendations: res.data.actionableNextSteps,
        aiOverview: res.data.executiveSummary,
        generatedAt: new Date().toLocaleTimeString(),
      };

      setCurrentSummary(newSum);
      saveSummary(newSum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportText = () => {
    const textContent = `=====================================================
DIGITAL CLASSROOM MANAGEMENT SYSTEM (DCMS)
END-OF-CLASS SESSION SUMMARY REPORT
=====================================================
Course: ${currentSummary.classroomTitle}
Date: ${currentSummary.sessionDate}
Topic Covered: ${currentSummary.topicCovered}
Generated At: ${currentSummary.generatedAt}

1. ATTENDANCE & PARTICIPATION METRICS
- Verified Attendance: ${currentSummary.attendancePresent} / ${currentSummary.attendanceTotal} (${currentSummary.attendanceRate}%)
- Unresolved Doubts in Queue: ${currentSummary.unresolvedDoubtsCount}

2. ASSESSMENT INSIGHTS
- Quiz Submissions Evaluated: ${currentSummary.quizTotalSubmissions}
- Average Assessment Score: ${currentSummary.quizAverageScore} / 20 marks

3. EXECUTIVE SYNTHESIS
${currentSummary.aiOverview}

4. IDENTIFIED WEAK TOPICS REQUIRING REVISION
${currentSummary.weakTopics.map((w, i) => `  ${i + 1}. ${w}`).join('\n')}

5. INSTRUCTOR ACTIONABLE NEXT STEPS
${currentSummary.recommendations.map((r, i) => `  * ${r}`).join('\n')}

6. HOMEWORK ASSIGNED
${currentSummary.assignedHomework.map((h, i) => `  - ${h}`).join('\n')}
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DCMS_EndOfClass_Summary_${today}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">End-of-Class Session Summary</h1>
            <AIModeBadge />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated pedagogical debrief aggregating attendance telemetry, quiz comprehension, and weak areas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (.TXT)</span>
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing Lecture...' : 'Re-Generate AI Summary'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Class Attendance</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {currentSummary.attendancePresent} / {currentSummary.attendanceTotal}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{currentSummary.attendanceRate}% Verified</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Quiz Mean Score</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {currentSummary.quizAverageScore} <span className="text-sm font-normal text-slate-400">/ 20</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{currentSummary.quizTotalSubmissions} student tests evaluated</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Unresolved Doubts</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{currentSummary.unresolvedDoubtsCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting teacher resolution</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-slate-400">Current Topic</p>
          <p className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">{currentSummary.topicCovered}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Session: {currentSummary.sessionDate}</p>
        </div>
      </div>

      {/* Main AI Summary Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">Executive Lecture Synthesis</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            {currentSummary.aiOverview}
          </p>
        </div>

        {/* Weak topics & Recommended Action Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Concepts Requiring Student Revision
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentSummary.weakTopics.map((wt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="font-semibold">{wt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/30 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Recommended Next Pedagogical Steps
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentSummary.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Assigned Homework */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Homework Assigned in this Class
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentSummary.assignedHomework.map((hw, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
              >
                {hw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
