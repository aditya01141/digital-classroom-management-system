import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  User as UserIcon,
  LogOut,
  Repeat,
  ChevronDown,
  BookOpen,
  Menu,
  X,
  Radio,
  BarChart2,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClassroom } from '../../context/ClassroomContext';
import { AIModeBadge } from '../common/AIModeBadge';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { classrooms, activeClassroomId, setActiveClassroomId, activeClassroom } = useClassroom();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    const nextRole = role === 'teacher' ? 'student' : 'teacher';
    switchRole(nextRole);
    navigate(nextRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  Digital<span className="text-blue-600">Classroom</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:inline">
                  Smarter Learning. Better Teaching.
                </span>
              </div>
            </Link>

            {/* Active Class Indicator Dropdown */}
            {user && (
              <div className="relative ml-4 hidden lg:block">
                <button
                  onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold">{activeClassroom?.code}:</span>
                  <span className="max-w-[140px] truncate">{activeClassroom?.title}</span>
                  {activeClassroom?.activeSession && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {classDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Select Classroom Context
                    </div>
                    {classrooms.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveClassroomId(c.id);
                          setClassDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          c.id === activeClassroomId ? 'bg-blue-50/80 text-blue-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <p className="font-semibold text-slate-900">{c.code}</p>
                          <p className="text-slate-500 text-[11px] truncate">{c.title}</p>
                        </div>
                        {c.activeSession && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold">
                            LIVE
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Navigation / AI / Role Toggle / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <AIModeBadge />

            <Link
              to="/ai/workspace"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Learning Workspace</span>
            </Link>

            {user ? (
              <>
                {/* 1-Click Role Switcher for instant demo evaluation */}
                <button
                  onClick={handleRoleToggle}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-xs cursor-pointer"
                  title="Switch between Teacher and Student modes instantly"
                >
                  <Repeat className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    Role: <strong className="capitalize">{role}</strong>
                  </span>
                </button>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize mt-0.5 font-medium">{user.role}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                          {user.role} Demo Account
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>

                      <Link
                        to="/analytics"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <BarChart2 className="w-4 h-4 text-slate-400" />
                        <span>Performance Analytics</span>
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <AIModeBadge />
            {user && (
              <button
                onClick={handleRoleToggle}
                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold"
              >
                Switch to {role === 'teacher' ? 'Student' : 'Teacher'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <Link
              to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700"
            >
              Dashboard
            </Link>
            <Link
              to="/ai/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-purple-50 text-purple-700 rounded-lg"
            >
              AI Workspace
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700"
            >
              Analytics
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700"
            >
              Settings
            </Link>
          </div>

          {user ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="text-xs font-bold text-rose-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
