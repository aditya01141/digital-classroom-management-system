import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  Play,
  Square,
  Copy,
  Check,
  Radio,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TeacherClassrooms: React.FC = () => {
  const { classrooms, createClassroom, toggleSessionState, activeClassroomId, setActiveClassroomId } = useClassroom();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('CS-3A');
  const [scheduledTime, setScheduledTime] = useState('Mon, Wed • 10:00 AM - 11:30 AM');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    createClassroom(
      title,
      subject,
      description,
      section,
      scheduledTime,
      user?.id || 'usr_teacher_01',
      user?.name || 'Dr. Aarav Sharma'
    );

    setTitle('');
    setSubject('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Classrooms & Live Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your courses, share join codes with students, and initiate real-time lecture broadcasts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Classroom</span>
        </button>
      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((cls) => {
          const isSelected = cls.id === activeClassroomId;
          return (
            <div
              key={cls.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                {/* Top Badge & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {cls.section} • {cls.subject}
                  </span>
                  {cls.activeSession ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Inactive</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{cls.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cls.description}</p>

                {/* Join Code Box */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Class Join Code</span>
                    <span className="font-mono text-sm font-black text-slate-900">{cls.code}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(cls.code)}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title="Copy code to clipboard"
                  >
                    {copiedCode === cls.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Info row */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.studentCount || 0} Enrolled Students</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => toggleSessionState(cls.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    cls.activeSession
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {cls.activeSession ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>End Stream</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Class</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/classrooms/${cls.id}`}
                  onClick={() => setActiveClassroomId(cls.id)}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                >
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Classroom */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Digital Classroom"
        subtitle="A unique 6-character join code will automatically be generated for your students."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Classroom / Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Cloud Computing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Domain</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
              <input
                type="text"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Schedule / Timings</label>
            <input
              type="text"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Description & Goals</label>
            <textarea
              rows={3}
              placeholder="Brief summary of learning objectives, syllabus, and assessment requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Create Classroom
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
