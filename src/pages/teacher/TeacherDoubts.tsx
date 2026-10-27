import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, MessageSquare, Send, Search } from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const TeacherDoubts: React.FC = () => {
  const { doubts, classrooms, activeClassroom, answerDoubt } = useClassroom();
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const filteredDoubts = doubts.filter((d) => {
    const matchClass = selectedClassId === 'ALL' || d.classroomId === selectedClassId;
    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
    return matchClass && matchStatus;
  });

  const handleReply = (doubtId: string) => {
    const text = replyText[doubtId];
    if (text && text.trim()) {
      answerDoubt(doubtId, text.trim(), user?.name || 'Dr. Aarav Sharma');
      setReplyText({ ...replyText, [doubtId]: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doubt & Query Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Resolve student classroom inquiries and manage digitally raised hands.
          </p>
        </div>

        <Badge variant="rose" size="md">
          {doubts.filter((d) => d.status === 'unanswered').length} Open Doubts
        </Badge>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Classroom:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden"
          >
            <option value="ALL">All Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'unanswered', 'answered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs text-xs text-slate-400">
            No doubts match the selected criteria.
          </div>
        ) : (
          filteredDoubts.map((d) => (
            <div
              key={d.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all ${
                d.isHandRaised
                  ? 'border-rose-300 ring-2 ring-rose-200/50'
                  : d.status === 'unanswered'
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{d.studentName}</span>
                  {d.isHandRaised && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse">
                      ✋ Hand Raised in Live Class
                    </span>
                  )}
                  <Badge variant={d.status === 'answered' ? 'success' : 'warning'} size="sm">
                    {d.status.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-slate-400 text-[11px]">{d.createdAt}</span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                "{d.message}"
              </p>

              {d.status === 'answered' ? (
                <div className="mt-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-900">
                      Instructor Resolution ({d.respondedBy}):
                    </span>
                    <span className="text-[10px] text-blue-500">{d.respondedAt}</span>
                  </div>
                  <p className="leading-relaxed mt-1">{d.response}</p>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Write Instructor Response:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Clarify this doubt for the student..."
                      value={replyText[d.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [d.id]: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:outline-hidden"
                    />
                    <button
                      onClick={() => handleReply(d.id)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Answer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
