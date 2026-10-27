import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const StudentDoubts: React.FC = () => {
  const { doubts, classrooms, activeClassroom, raiseDoubt, toggleRaiseHand } = useClassroom();
  const { user } = useAuth();

  const [question, setQuestion] = useState('');
  const [classroomId, setClassroomId] = useState(activeClassroom?.id || 'cls_se_301');

  const myDoubts = doubts.filter((d) => d.studentId === (user?.id || 'usr_student_01'));

  const isHandRaised = doubts.some(
    (d) => d.studentId === user?.id && d.classroomId === classroomId && d.isHandRaised
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !user) return;

    raiseDoubt(classroomId, user.id, user.name, question.trim(), false);
    setQuestion('');
  };

  const handleToggleHand = () => {
    if (user) {
      toggleRaiseHand(user.id, user.name, classroomId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Classroom Doubts & Live Interaction</h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit questions directly to your teacher and receive written resolutions.
          </p>
        </div>

        <button
          onClick={handleToggleHand}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
            isHandRaised
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
          }`}
        >
          <span>✋</span>
          <span>{isHandRaised ? 'Hand Raised in Live Class (Lower)' : 'Raise Digital Hand'}</span>
        </button>
      </div>

      {/* Ask Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Submit a Question to Course Instructor</h3>
        <p className="text-xs text-slate-500 mb-4">
          Select the classroom and write your inquiry below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Classroom</label>
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-semibold"
            >
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title} (Instructor: {c.teacherName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Question / Doubt</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Could you please clarify why the verification token is verified before attendance is logged?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Question</span>
            </button>
          </div>
        </form>
      </div>

      {/* Doubts History List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">My Submitted Inquiries</h3>

        <div className="space-y-4">
          {myDoubts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No doubts submitted yet.</p>
          ) : (
            myDoubts.map((d) => (
              <div
                key={d.id}
                className={`p-4 rounded-2xl border transition-all ${
                  d.status === 'answered'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={d.status === 'answered' ? 'success' : 'warning'} size="sm">
                      {d.status.toUpperCase()}
                    </Badge>
                    {d.isHandRaised && (
                      <span className="text-[10px] font-bold text-rose-600 animate-pulse">
                        ✋ Hand Raised
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[10px]">{d.createdAt}</span>
                </div>

                <p className="text-xs text-slate-800 font-semibold">{d.message}</p>

                {d.status === 'answered' ? (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-emerald-800">
                      Instructor Resolution ({d.respondedBy}) • {d.respondedAt}:
                    </p>
                    <p className="text-slate-700 leading-relaxed">{d.response}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700 font-medium mt-2">
                    Awaiting instructor reply in active lecture queue.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
