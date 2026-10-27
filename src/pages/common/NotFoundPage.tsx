import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center antialiased">
      <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-6">
        <GraduationCap className="w-9 h-9" />
      </div>

      <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Error 404</span>
      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Classroom Resource Not Found</h1>
      <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        The requested digital classroom module or route does not exist or may have been archived.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
