import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Search,
  Check,
  Flag,
  FileText,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { IntegrityFlag } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TeacherIntegrity: React.FC = () => {
  const { flags, reviewFlag } = useClassroom();
  const [selectedFlag, setSelectedFlag] = useState<IntegrityFlag | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'reviewed'>('ALL');

  const filteredFlags = flags.filter((f) => {
    if (statusFilter === 'pending') return !f.reviewed;
    if (statusFilter === 'reviewed') return f.reviewed;
    return true;
  });

  const handleOpenReview = (flag: IntegrityFlag) => {
    setSelectedFlag(flag);
    setReviewNotes(flag.teacherActionNote || '');
  };

  const handleResolve = (resolution: 'cleared' | 'flagged_for_investigation') => {
    if (!selectedFlag) return;
    reviewFlag(selectedFlag.id, resolution, reviewNotes.trim() || 'Reviewed by instructor.');
    setSelectedFlag(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Integrity Monitoring</h1>
          <p className="text-xs text-slate-500 mt-1">
            Human-in-the-loop review for client-side blur events and assessment similarity signals.
          </p>
        </div>

        <Badge variant="purple" size="md">
          {flags.filter((f) => !f.reviewed).length} Awaiting Instructor Review
        </Badge>
      </div>

      {/* Transparency Alert Box — strictly fulfilling Section 7 & 11 */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-5 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Transparent & Consent-Based Monitoring Policy (UML Spec)</p>
          <p className="text-blue-800 leading-relaxed text-[11px]">
            In accordance with the project SRS and ethical guidelines, suspicious events (such as tab switches
            or window blur during a quiz) are treated as <strong>signals for instructor review</strong>,
            never as automatic declarations of misconduct. Operating system notifications, browser crashes, or
            accessibility software can trigger false positives. The instructor retains sole authority to evaluate context.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Logs ({flags.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Review ({flags.filter((f) => !f.reviewed).length})
          </button>
          <button
            onClick={() => setStatusFilter('reviewed')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              statusFilter === 'reviewed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Resolved ({flags.filter((f) => f.reviewed).length})
          </button>
        </div>

        <span className="text-slate-400 text-[11px]">Showing {filteredFlags.length} items</span>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {filteredFlags.map((flag) => (
          <div
            key={flag.id}
            className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              flag.reviewed
                ? 'border-slate-200 bg-slate-50/50'
                : flag.severity === 'high'
                ? 'border-rose-300 ring-1 ring-rose-200'
                : 'border-purple-200 bg-purple-50/20'
            }`}
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{flag.studentName}</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-600 font-semibold">{flag.activityTitle}</span>
                <Badge
                  variant={
                    flag.severity === 'high'
                      ? 'danger'
                      : flag.severity === 'medium'
                      ? 'warning'
                      : 'purple'
                  }
                  size="sm"
                >
                  {flag.severity.toUpperCase()} SEVERITY
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded text-[10px] font-bold">
                  {flag.eventType}
                </span>
                <span className="text-slate-400 text-[11px]">{flag.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">
                {flag.details}
              </p>

              {flag.reviewed && (
                <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-emerald-700">Resolution Status: </span>
                  <span className="capitalize font-semibold text-slate-800">
                    {flag.resolutionStatus?.replace('_', ' ')}
                  </span>
                  {flag.teacherActionNote && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{flag.teacherActionNote}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                onClick={() => handleOpenReview(flag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  flag.reviewed
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {flag.reviewed ? 'Update Notes' : 'Review Event'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Dialog Modal */}
      <Modal
        isOpen={Boolean(selectedFlag)}
        onClose={() => setSelectedFlag(null)}
        title="Human-in-the-Loop Integrity Review"
        subtitle={`Candidate: ${selectedFlag?.studentName} • Event: ${selectedFlag?.eventType}`}
      >
        {selectedFlag && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-900">Event Telemetry Log:</p>
              <p className="text-slate-700 leading-relaxed">{selectedFlag.details}</p>
              <p className="text-[11px] text-slate-400 font-mono">Timestamp: {selectedFlag.timestamp}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instructor Decision Remarks & Context:
              </label>
              <textarea
                rows={3}
                placeholder="Explain resolution (e.g. Cleared after verification, or flagged for further inquiry)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleResolve('cleared')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Clear Flag (False Positive)</span>
              </button>

              <button
                type="button"
                onClick={() => handleResolve('flagged_for_investigation')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Flag for Department Review</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
