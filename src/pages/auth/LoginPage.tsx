import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('teacher');
  const [email, setEmail] = useState('teacher@digitalclassroom.edu');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'teacher') {
      setEmail('teacher@digitalclassroom.edu');
    } else {
      setEmail('student@digitalclassroom.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid educational email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(email, role);
      setLoading(false);
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    }, 400);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    handleRoleChange(demoRole);
    login(
      demoRole === 'teacher' ? 'teacher@digitalclassroom.edu' : 'student@digitalclassroom.edu',
      demoRole
    );
    navigate(demoRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Digital Classroom</h2>
        <p className="mt-1 text-xs text-slate-500">
          Smarter Learning. Better Teaching. • Select your role below
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200">
          {/* Role Selector Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Instructor / Teacher
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Enrolled Student
            </button>
          </div>

          {/* Quick 1-Click Demo Login Buttons */}
          <div className="mb-6 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Instant 1-Click Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Dr. Aarav (Teacher)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Rohan (Student)</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-slate-900 bg-white"
                placeholder="name@digitalclassroom.edu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all text-slate-900 bg-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Demo Auth Mode
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {role === 'teacher' ? 'Instructor' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register here
            </Link>
          </div>

          {/* Disclaimer as required by Master Prompt Section 6 */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p>
              <strong>Demo Environment:</strong> Authentication is handled locally with sample accounts and session persistence.
              Ready for production integration with Python Flask + MySQL JWT backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
