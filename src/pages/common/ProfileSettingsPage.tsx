import React, { useState } from 'react';
import {
  User as UserIcon,
  Save,
  RotateCcw,
  Sparkles,
  Shield,
  Database,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClassroom } from '../../context/ClassroomContext';
import { aiService } from '../../services/aiService';
import { AIModeBadge } from '../../components/common/AIModeBadge';
import { Badge } from '../../components/common/Badge';

export const ProfileSettingsPage: React.FC = () => {
  const { user, role, updateProfile } = useAuth();
  const { resetAllDemoData } = useClassroom();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [designation, setDesignation] = useState(user?.designation || 'Associate Professor');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || 'CS23B1042');
  const [program, setProgram] = useState(user?.program || 'B.Tech Computer Science');
  const [section, setSection] = useState(user?.section || '3A');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      ...(role === 'teacher' ? { department, designation } : { rollNumber, program, section }),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo state (classrooms, materials, attendance, notes, quizzes) to original sample data?')) {
      resetAllDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile & System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your demo credentials, AI provider configuration, and persistent local storage state.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-2xl text-blue-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <span>All demo classrooms, materials, and submissions restored to initial defaults!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500 capitalize">{user?.role} Account</p>
            </div>
          </div>
          <Badge variant="primary" size="md">
            Active Session
          </Badge>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {role === 'teacher' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree Program</label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Provider Configuration Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">AI Provider Architecture & Secrets</h3>
          </div>
          <AIModeBadge />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The system implements a dual-mode AI abstraction layer. When a real API key is configured via the environment variable{' '}
          <code className="bg-slate-100 text-purple-700 px-2 py-0.5 rounded font-mono">VITE_GEMINI_API_KEY</code>,
          live LLM requests are dispatched. If no key is configured, the system executes deterministic educational responses without leaking errors or exposing secret credentials on client bundles.
        </p>

        <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs space-y-1.5 text-purple-950">
          <p className="font-bold">Active Configuration Details:</p>
          <p className="text-[11px] font-mono">Provider: {aiService.providerName}</p>
          <p className="text-[11px] font-mono">API Key Status: {aiService.isConfigured ? 'Loaded from Environment' : 'Unset (Using Demo Fallback Engine)'}</p>
        </div>
      </div>

      {/* Local Storage & Reset Defaults */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Reset Demo State</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear all created classrooms, submitted homework, and notes back to the rich college demo template.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Restore Demo Defaults</span>
        </button>
      </div>
    </div>
  );
};
