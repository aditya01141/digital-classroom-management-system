import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Radio,
  BookOpen,
  HelpCircle,
  Play,
  Square,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  CalendarCheck,
  Send,
  Lock,
  Unlock,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const ClassroomSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    classrooms,
    materials,
    attendance,
    doubts,
    polls,
    togglePublishMaterial,
    toggleSessionState,
    updateCurrentTopic,
    answerDoubt,
    createPoll,
  } = useClassroom();
  const { user } = useAuth();

  const currentClass = classrooms.find((c) => c.id === id) || classrooms[0];
  const classMaterials = materials.filter((m) => m.classroomId === currentClass?.id);
  const classAttendance = attendance.filter((a) => a.classroomId === currentClass?.id);
  const classDoubts = doubts.filter((d) => d.classroomId === currentClass?.id);
  const classPolls = polls.filter((p) => p.classroomId === currentClass?.id);

  const [topicInput, setTopicInput] = useState(currentClass?.currentTopic || '');
  const [doubtReplies, setDoubtReplies] = useState<Record<string, string>>({});
  const [quickQuestion, setQuickQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option A', 'Option B', 'Option C']);

  const handleTopicUpdate = () => {
    if (topicInput.trim() && currentClass) {
      updateCurrentTopic(currentClass.id, topicInput.trim());
    }
  };

  const handleSendDoubtReply = (doubtId: string) => {
    const text = doubtReplies[doubtId];
    if (text && text.trim()) {
      answerDoubt(doubtId, text.trim(), user?.name || 'Dr. Aarav Sharma');
      setDoubtReplies({ ...doubtReplies, [doubtId]: '' });
    }
  };

  const handleLaunchPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim() || !currentClass) return;
    createPoll(currentClass.id, quickQuestion.trim(), pollOptions.filter((o) => o.trim()));
    setQuickQuestion('');
  };

  if (!currentClass) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Classroom not found.{' '}
        <Link to="/teacher/classrooms" className="text-blue-600 underline">
          Return to classrooms
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Live Broadcast Status */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentClass.code}
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{currentClass.title}</h1>
            {currentClass.activeSession ? (
              <Badge variant="success" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Broadcast
              </Badge>
            ) : (
              <Badge variant="slate" size="sm">
                Session Paused
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section {currentClass.section} • {currentClass.scheduledTime} • Instructor: {currentClass.teacherName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSessionState(currentClass.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              currentClass.activeSession
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {currentClass.activeSession ? (
              <>
                <Square className="w-4 h-4" />
                <span>Close Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <Link
            to="/teacher/summary"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>End-of-Class AI Summary</span>
          </Link>
        </div>
      </div>

      {/* Control Topic & Sequential Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Broadcast Controller & Materials Sequential Lock */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Topic Broadcast Switcher */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">Live Broadcaster: Controlled Student View</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Students connected to this session will see this topic headline and live instruction synchronized on their screen.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter current lecture topic / focus area..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <button
                onClick={handleTopicUpdate}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Broadcast Topic
              </button>
            </div>
          </div>

          {/* Sequential Study Materials & View Control (FR-01, FR-02, FR-04) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sequential Learning Materials & Visibility</h3>
                  <p className="text-xs text-slate-500">
                    Control which activities students can see and unlock sequential prerequisites.
                  </p>
                </div>
              </div>
              <Link
                to="/teacher/materials"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                + Add Content
              </Link>
            </div>

            <div className="space-y-3">
              {classMaterials.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No materials uploaded yet.</p>
              ) : (
                classMaterials.map((mat, idx) => (
                  <div
                    key={mat.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      mat.isPublished
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200 bg-slate-50/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{mat.title}</span>
                          <Badge variant={mat.isPublished ? 'success' : 'slate'} size="sm">
                            {mat.isPublished ? 'Visible to Students' : 'Hidden / Locked'}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Type: <strong>{mat.type}</strong> • Completed by {mat.completedByStudentIds?.length || 0} students
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePublishMaterial(mat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        mat.isPublished
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {mat.isPublished ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide from Class</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unlock & Publish</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Real-Time Polling Section (FR-03 & FR-09) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Broadcast Instant Question / Poll</h3>
              </div>
              <Link to="/teacher/polls" className="text-xs font-bold text-blue-600">
                Poll Results Archive →
              </Link>
            </div>

            <form onSubmit={handleLaunchPoll} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Ask a quick live question (e.g. Which diagram models dynamic message flows?)"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[i] = e.target.value;
                      setPollOptions(next);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800"
                    placeholder={`Option ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Poll to Class</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Verified Attendance & Live Raised Hands / Doubts */}
        <div className="space-y-6">
          {/* Live Verified Attendance */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Verified Attendance ({classAttendance.length})</h3>
              </div>
              <Link to="/teacher/attendance" className="text-xs font-bold text-blue-600">
                Full Roster →
              </Link>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Verified by Identity / Device Verification Service on student session check-in.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {classAttendance.map((att) => (
                <div
                  key={att.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{att.studentName}</span>
                    <span className="text-slate-400 text-[10px] block font-mono">{att.deviceFingerprint}</span>
                  </div>
                  <Badge variant={att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'} size="sm">
                    {att.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Live Doubts & Raised Hands Queue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Doubts Queue</h3>
              </div>
              <Badge variant="rose" size="sm">
                {classDoubts.filter((d) => d.status === 'unanswered').length} Open
              </Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {classDoubts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No doubts asked yet.</p>
              ) : (
                classDoubts.map((d) => (
                  <div
                    key={d.id}
                    className={`p-3 rounded-xl border text-xs ${
                      d.isHandRaised
                        ? 'border-rose-300 bg-rose-50/50'
                        : d.status === 'answered'
                        ? 'border-slate-200 bg-slate-50'
                        : 'border-amber-200 bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>{d.studentName}</span>
                      {d.isHandRaised && (
                        <span className="text-[10px] font-extrabold text-rose-600 animate-pulse">
                          ✋ Hand Raised
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 font-medium text-[11px]">{d.message}</p>

                    {d.status === 'answered' ? (
                      <div className="mt-2 p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-blue-800">
                        <strong>Reply:</strong> {d.response}
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1.5">
                        <input
                          type="text"
                          placeholder="Type instructor resolution..."
                          value={doubtReplies[d.id] || ''}
                          onChange={(e) =>
                            setDoubtReplies({ ...doubtReplies, [d.id]: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                        />
                        <button
                          onClick={() => handleSendDoubtReply(d.id)}
                          className="w-full py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Resolve & Send
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
