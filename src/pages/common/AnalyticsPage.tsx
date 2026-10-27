import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  CalendarCheck,
  FileCheck2,
  Users,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const AnalyticsPage: React.FC = () => {
  const { classrooms, activeClassroom, attendance, submissions, quizzes } = useClassroom();
  const { role } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');

  // Sample analytics data derived from demo records
  const attendanceTrendData = [
    { date: 'Oct 21', rate: 92, verified: 35 },
    { date: 'Oct 23', rate: 85, verified: 32 },
    { date: 'Oct 25', rate: 95, verified: 36 },
    { date: 'Oct 26', rate: 89, verified: 34 },
    { date: 'Oct 27', rate: 88, verified: 33 },
  ];

  const quizDistributionData = [
    { scoreRange: '0 - 5', students: 1 },
    { scoreRange: '6 - 10', students: 3 },
    { scoreRange: '11 - 15', students: 12 },
    { scoreRange: '16 - 20', students: 26 },
  ];

  const conceptMasteryData = [
    { topic: 'UML Sequence Diagrams', mastery: 94 },
    { topic: 'Component & DFD Modeling', mastery: 88 },
    { topic: 'Relational Normalization', mastery: 78 },
    { topic: 'ACID Transaction Locks', mastery: 72 },
    { topic: 'Aggregation vs Composition', mastery: 58 },
  ];

  const statusPieData = [
    { name: 'Present (Hardware Verified)', value: 33, color: '#10b981' },
    { name: 'Late Check-in', value: 3, color: '#f59e0b' },
    { name: 'Absent / Unrecorded', value: 4, color: '#f43f5e' },
  ];

  const handleExportAnalyticsCSV = () => {
    const headers = ['Topic / Concept', 'Classroom Mastery Percentage', 'Status Indicator'];
    const rows = conceptMasteryData.map((d) => [
      `"${d.topic}"`,
      `${d.mastery}%`,
      d.mastery < 65 ? 'Weak Concept (Review Required)' : 'Satisfactory Mastery',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `DCMS_Concept_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Performance Analytics & Reporting</h1>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven insights on attendance verification, quiz score distributions, and topic mastery.
          </p>
        </div>

        <button
          onClick={handleExportAnalyticsCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Classroom filter selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Course Scope:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden"
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <Badge variant="primary" size="sm">
          Analytics Engine v2.0
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance Rate"
          value="89.6%"
          subtitle="Hardware verified attendance"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Mean Assessment Score"
          value="17.4 / 20"
          subtitle="Top decile comprehension"
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Homework Completion"
          value="92.1%"
          subtitle="Submitted before deadlines"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Identified Weak Topics"
          value="2 Topics"
          subtitle="Flagged for lecture recap"
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Attendance Verification Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Attendance Verification Rate (%)</h3>
            <span className="text-xs text-slate-400 font-medium">Past 5 Lectures</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563eb' }}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Assessment Score Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Assessment Score Distribution</h3>
            <span className="text-xs text-slate-400 font-medium">Students per Grade Bracket</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="scoreRange" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#7c3aed" radius={[8, 8, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak Topics Analysis Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Concept Mastery & Weak-Topic Indicators</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Derived from assessment mistake analysis to direct teacher recaps and AI remediation.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">Class Average</span>
        </div>

        <div className="space-y-3">
          {conceptMasteryData.map((item, idx) => {
            const isWeak = item.mastery < 65;

            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">{item.topic}</span>
                    {isWeak && (
                      <Badge variant="danger" size="sm">
                        Weak Concept (Review Required)
                      </Badge>
                    )}
                  </div>
                  <span className={isWeak ? 'text-rose-600 font-black' : 'text-slate-700'}>
                    {item.mastery}% Mastery
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWeak ? 'bg-rose-500' : item.mastery > 85 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
