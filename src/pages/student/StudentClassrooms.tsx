import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Users, Clock, Radio, ArrowRight } from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const StudentClassrooms: React.FC = () => {
  const { classrooms } = useClassroom();
  const { user } = useAuth();

  const enrolled = classrooms.filter((c) =>
    c.enrolledStudents?.includes(user?.id || 'usr_student_01')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Enrolled Classrooms</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your courses, view live lecture broadcasts, and complete sequential activities.
          </p>
        </div>

        <Link
          to="/student/join"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Join with Code</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolled.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {cls.code}
                </span>
                {cls.activeSession ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    LIVE NOW
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Offline</span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">{cls.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cls.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Instructor: {cls.teacherName}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to={`/student/classrooms/${cls.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Enter Classroom Stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
