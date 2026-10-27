import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Radio, ArrowRight } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { activeClassroom } = useClassroom();
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar />

      {/* Live Classroom Active Broadcast Banner */}
      {activeClassroom?.activeSession && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2 text-xs shadow-sm flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-bold">Live Session in Progress:</span>
              <span className="font-semibold text-blue-100">{activeClassroom.title} ({activeClassroom.code})</span>
              <span className="hidden md:inline text-blue-200 text-[11px]">— Topic: {activeClassroom.currentTopic}</span>
            </div>
            <Link
              to={role === 'teacher' ? `/classrooms/${activeClassroom.id}` : `/student/classrooms/${activeClassroom.id}`}
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md text-[11px] font-bold text-white transition-colors"
            >
              <span>{role === 'teacher' ? 'Control Live Session' : 'Enter Classroom Stream'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
