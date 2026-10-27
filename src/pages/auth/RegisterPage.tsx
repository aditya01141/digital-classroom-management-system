import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Role specific fields
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [rollNumber, setRollNumber] = useState('CS23B1088');
  const [program, setProgram] = useState('B.Tech Computer Science');
  const [section, setSection] = useState('3A');

  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid educational email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const details: Record<string, string> =
      role === 'teacher'
        ? { department, designation }
        : { rollNumber, program, section };

    register(name, email, role, details);
    navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create DCMS Demo Account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Join the Digital Classroom Management System as Teacher or Student
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200">
          {/* Role selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'student' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Enrolled Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'teacher' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Course Instructor / Teacher
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'teacher' ? 'Dr. Jane Smith' : 'Alex Johnson'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            {/* Role specific inputs */}
            {role === 'teacher' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Program</label>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create {role === 'teacher' ? 'Instructor' : 'Student'} Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
