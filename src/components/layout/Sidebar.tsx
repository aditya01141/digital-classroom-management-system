import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  HelpCircle,
  FileCheck2,
  FolderGit2,
  ShieldAlert,
  Sparkles,
  BarChart3,
  FileText,
  FileSignature,
  PlusCircle,
  Radio,
  BookMarked,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClassroom } from '../../context/ClassroomContext';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { role } = useAuth();
  const { doubts, homeworks, submissions, flags, activeClassroom } = useClassroom();

  const unansweredDoubts = doubts.filter((d) => d.status === 'unanswered').length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted').length;
  const pendingFlags = flags.filter((f) => !f.reviewed).length;

  const teacherLinks: NavItem[] = [
    { to: '/teacher/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      to: '/teacher/classrooms',
      label: 'Classrooms & Live Hub',
      icon: Users,
      badge: activeClassroom?.activeSession ? 'LIVE' : undefined,
      badgeColor: 'emerald',
    },
    { to: '/teacher/materials', label: 'Study Materials', icon: BookOpen },
    { to: '/teacher/attendance', label: 'Attendance Roster', icon: CalendarCheck },
    { to: '/teacher/polls', label: 'Questions & Polls', icon: Radio },
    { to: '/teacher/quizzes', label: 'Quizzes & Tests', icon: FileCheck2 },
    {
      to: '/teacher/homework',
      label: 'Homework & Grading',
      icon: FolderGit2,
      badge: pendingSubmissions > 0 ? String(pendingSubmissions) : undefined,
      badgeColor: 'amber',
    },
    {
      to: '/teacher/doubts',
      label: 'Doubt Management',
      icon: HelpCircle,
      badge: unansweredDoubts > 0 ? String(unansweredDoubts) : undefined,
      badgeColor: 'rose',
    },
    {
      to: '/teacher/integrity',
      label: 'Academic Integrity',
      icon: ShieldAlert,
      badge: pendingFlags > 0 ? String(pendingFlags) : undefined,
      badgeColor: 'purple',
    },
    { to: '/analytics', label: 'Performance Analytics', icon: BarChart3 },
    { to: '/teacher/summary', label: 'End-of-Class Summary', icon: FileText },
  ];

  const studentLinks: NavItem[] = [
    { to: '/student/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/student/classrooms', label: 'My Classrooms', icon: BookOpen },
    { to: '/student/join', label: 'Join Classroom', icon: PlusCircle },
    { to: '/student/materials', label: 'Study Materials', icon: BookMarked },
    { to: '/student/quizzes', label: 'Quizzes & Tests', icon: FileCheck2 },
    { to: '/student/homework', label: 'Homework Submissions', icon: FolderGit2 },
    { to: '/student/notes', label: 'Digital Notes', icon: FileSignature },
    {
      to: '/student/doubts',
      label: 'Doubts & Raise Hand',
      icon: HelpCircle,
      badge: unansweredDoubts > 0 ? `${unansweredDoubts} open` : undefined,
    },
    { to: '/student/progress', label: 'My Performance', icon: TrendingUp },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 ${className}`}>
      {/* Session Header Status */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="uppercase tracking-wider font-bold">Class Context</span>
          {activeClassroom?.activeSession && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-white truncate">{activeClassroom?.code || 'SE-2026'}</p>
        <p className="text-xs text-slate-400 truncate">{activeClassroom?.title || 'Advanced Software Eng'}</p>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {role === 'teacher' ? 'Instructor Portal' : 'Student Learning Hub'}
        </div>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300'
                      : item.badgeColor === 'rose'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* AI Workspace Callout */}
        <div className="pt-4 mt-2 border-t border-slate-800">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Superpowers</span>
          </div>
          <NavLink
            to="/ai/workspace"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-900/50'
              }`
            }
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Learning Assistant</span>
          </NavLink>
        </div>
      </nav>

      {/* Role Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span className="capitalize text-[11px] font-medium">Logged in as {role}</span>
          <span className="text-[10px] font-mono text-slate-500">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
