import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Laptop,
  Cpu,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { DeviceVerificationResult } from '../../services/verificationService';

export const StudentJoinClass: React.FC = () => {
  const [code, setCode] = useState('SE-2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState<DeviceVerificationResult | null>(null);
  const [joinedClassTitle, setJoinedClassTitle] = useState('');

  const { joinClassroom, classrooms } = useClassroom();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await joinClassroom(
        code.trim(),
        user?.id || 'usr_student_01',
        user?.name || 'Rohan Verma',
        user?.rollNumber || 'CS23B1042'
      );

      if (res.success) {
        setVerificationResult(res.verification || null);
        const match = classrooms.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
        setJoinedClassTitle(match?.title || 'Classroom');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to verification service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Join a Digital Classroom</h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter the 6-character course code provided by your instructor to authenticate and enroll.
        </p>
      </div>

      {/* Code Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Classroom Join Code (e.g. SE-2026, DBMS-88, ML-404)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SE-2026"
                className="flex-1 font-mono uppercase text-sm font-bold tracking-wider px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Device...</span>
                ) : (
                  <>
                    <span>Verify & Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Code helper buttons */}
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Try Sample Codes:</span>
            <button
              type="button"
              onClick={() => setCode('SE-2026')}
              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold hover:bg-blue-100 cursor-pointer"
            >
              SE-2026
            </button>
            <button
              type="button"
              onClick={() => setCode('DBMS-88')}
              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold hover:bg-blue-100 cursor-pointer"
            >
              DBMS-88
            </button>
            <button
              type="button"
              onClick={() => setCode('ML-404')}
              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold hover:bg-blue-100 cursor-pointer"
            >
              ML-404
            </button>
          </div>
        </form>
      </div>

      {/* Verification Certificate Result Box (UML Sequence Diagram Step 8-12) */}
      {verificationResult && (
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Identity & Device Verification Passed</h3>
                <p className="text-xs text-emerald-300 font-medium">
                  Attendance recorded for {user?.name} ({user?.rollNumber})
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700">
              {verificationResult.verificationToken}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Authenticated Device</span>
              <p className="font-bold text-slate-200">{verificationResult.deviceType}</p>
              <p className="text-[11px] text-slate-400">{verificationResult.os} • {verificationResult.browser}</p>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Hardware Fingerprint</span>
              <p className="font-mono text-xs font-bold text-emerald-400">{verificationResult.deviceId}</p>
              <p className="text-[11px] text-slate-400">{verificationResult.ipAddress}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Verified by External Identity Service at {verificationResult.timestamp}
            </p>
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
            >
              <span>Proceed to Learning Stream</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
