import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Radio,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  HelpCircle,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
  FileText,
  FileCheck2,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { StudyMaterial } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const StudentClassroomView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    classrooms,
    materials,
    polls,
    doubts,
    votePoll,
    raiseDoubt,
    toggleRaiseHand,
    markMaterialComplete,
  } = useClassroom();
  const { user } = useAuth();

  const currentClass = classrooms.find((c) => c.id === id) || classrooms[0];
  const classMaterials = materials
    .filter((m) => m.classroomId === currentClass?.id && m.isPublished)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  const classPolls = polls.filter((p) => p.classroomId === currentClass?.id);
  const classDoubts = doubts.filter((d) => d.classroomId === currentClass?.id);

  const [doubtText, setDoubtText] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const isHandRaised = doubts.some(
    (d) => d.studentId === user?.id && d.classroomId === currentClass?.id && d.isHandRaised
  );

  const handleRaiseHand = () => {
    if (user && currentClass) {
      toggleRaiseHand(user.id, user.name, currentClass.id);
    }
  };

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || !user || !currentClass) return;
    raiseDoubt(currentClass.id, user.id, user.name, doubtText.trim(), false);
    setDoubtText('');
  };

  const handleMarkDone = (matId: string) => {
    if (user) {
      markMaterialComplete(matId, user.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcasted Live Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentClass?.code}
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{currentClass?.title}</h1>
            {currentClass?.activeSession && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Broadcast
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Instructor: {currentClass?.teacherName}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRaiseHand}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isHandRaised
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <span>✋</span>
            <span>{isHandRaised ? 'Hand Raised (Lower)' : 'Raise Digital Hand'}</span>
          </button>
        </div>
      </div>

      {/* Teacher's Currently Broadcasted Focus (FR-02) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 shadow-md flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-2xl shrink-0">
          <Radio className="w-7 h-7 text-white animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
            Current Classroom Instruction Topic:
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">{currentClass?.currentTopic}</h2>
          <p className="text-xs text-blue-100 mt-1">
            Follow along with the sequential study materials and live polls below.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sequential Learning Pipeline & Polls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sequential Learning Path (FR-04) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sequential Learning Roadmap</h3>
                  <p className="text-xs text-slate-500">
                    Complete each sequential activity to unlock the next instructional milestone.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {classMaterials.map((mat, idx) => {
                const isCompleted = mat.completedByStudentIds?.includes(user?.id || 'usr_student_01');
                // Sequential rule: Step 0 is always open. Step N is unlocked if Step N-1 is completed!
                const isPrevCompleted =
                  idx === 0 ||
                  classMaterials[idx - 1].completedByStudentIds?.includes(user?.id || 'usr_student_01');
                const isUnlocked = isPrevCompleted;

                return (
                  <div
                    key={mat.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !isUnlocked
                        ? 'border-slate-200 bg-slate-100/60 opacity-60'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-blue-200 bg-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isUnlocked
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{mat.title}</h4>
                          {!isUnlocked && (
                            <Badge variant="slate" size="sm">
                              <Lock className="w-3 h-3" /> Locked
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="success" size="sm">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mat.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Format: <strong>{mat.type}</strong> • Step #{mat.sequenceOrder}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {isUnlocked && (
                        <>
                          <button
                            onClick={() => setPreviewMaterial(mat)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read</span>
                          </button>

                          {!isCompleted && (
                            <button
                              onClick={() => handleMarkDone(mat.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Done</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Polling Section (FR-03 & FR-09) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Active Classroom Poll</h3>
            </div>

            {classPolls.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active poll right now.</p>
            ) : (
              classPolls.map((poll) => {
                const votedOption = poll.votedUserIds?.[user?.id || 'usr_student_01'];

                return (
                  <div key={poll.id} className="p-4 bg-purple-50/30 rounded-2xl border border-purple-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">{poll.question}</h4>

                    <div className="space-y-2">
                      {poll.options.map((opt) => {
                        const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                        const isVoted = votedOption === opt.id;

                        return (
                          <button
                            key={opt.id}
                            disabled={Boolean(votedOption)}
                            onClick={() => votePoll(poll.id, opt.id, user?.id || 'usr_student_01')}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                              isVoted
                                ? 'border-purple-600 bg-purple-100/70 font-bold text-purple-950 ring-1 ring-purple-500'
                                : 'border-slate-200 bg-white hover:bg-purple-50 text-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span>
                                {opt.text} {isVoted && '✓ (Your Vote)'}
                              </span>
                              <span className="font-bold text-slate-500">
                                {opt.votes} ({pct}%)
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Ask Doubt & My Questions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Ask Instructor a Doubt</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your inquiry is delivered straight to Dr. Sharma's instructor dashboard.
            </p>

            <form onSubmit={handleSendDoubt} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Ask about a UML fragment, formula, or lecture point..."
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-rose-500 outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Query to Teacher</span>
              </button>
            </form>
          </div>

          {/* Doubt replies stream */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              My Doubts & Teacher Resolutions
            </h4>
            <div className="space-y-3">
              {classDoubts
                .filter((d) => d.studentId === user?.id)
                .map((d) => (
                  <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900">Q: {d.message}</p>
                    {d.status === 'answered' ? (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px]">
                        <strong>Teacher: </strong> {d.response}
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-bold block">
                        Waiting for instructor reply...
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Material */}
      <Modal
        isOpen={Boolean(previewMaterial)}
        onClose={() => setPreviewMaterial(null)}
        title={previewMaterial?.title || 'Learning Content'}
        subtitle={`Step #${previewMaterial?.sequenceOrder} • Category: ${previewMaterial?.type}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">{previewMaterial?.description}</p>

          {previewMaterial?.contentBody ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono whitespace-pre-wrap text-slate-800 max-h-80 overflow-y-auto">
              {previewMaterial.contentBody}
            </div>
          ) : previewMaterial?.fileUrl ? (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-900">Reference Material</p>
                <p className="text-blue-700 font-mono text-[11px] truncate max-w-sm">{previewMaterial.fileUrl}</p>
              </div>
              <a
                href={previewMaterial.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <span>Open File</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : null}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setPreviewMaterial(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
