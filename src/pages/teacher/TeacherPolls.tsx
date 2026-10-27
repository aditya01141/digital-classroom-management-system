import React, { useState } from 'react';
import { Radio, Plus, CheckCircle2, BarChart2, Users, Trash2 } from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TeacherPolls: React.FC = () => {
  const { polls, classrooms, activeClassroom, createPoll } = useClassroom();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['Option 1', 'Option 2', 'Option 3']);

  const filteredPolls = polls.filter(
    (p) => selectedClassId === 'ALL' || p.classroomId === selectedClassId
  );

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    createPoll(
      selectedClassId === 'ALL' ? (activeClassroom?.id || 'cls_se_301') : selectedClassId,
      question.trim(),
      options.filter((o) => o.trim().length > 0)
    );

    setQuestion('');
    setOptions(['Option 1', 'Option 2', 'Option 3']);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Classroom Polls</h1>
          <p className="text-xs text-slate-500 mt-1">
            Engage students with live comprehension checks and instant visual vote tallies.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Poll</span>
        </button>
      </div>

      {/* Classroom filter */}
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

        <Badge variant="purple" size="sm">
          {filteredPolls.length} Active Polls
        </Badge>
      </div>

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolls.map((poll) => (
          <div
            key={poll.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  <Radio className="w-3.5 h-3.5" />
                  <span>{poll.status.toUpperCase()}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{poll.createdAt}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{poll.question}</h3>

              <div className="mt-5 space-y-3">
                {poll.options.map((opt) => {
                  const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  return (
                    <div key={opt.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{opt.text}</span>
                        <span>
                          {opt.votes} votes ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Total Votes Cast: <strong>{poll.totalVotes}</strong></span>
              </div>
              <span className="text-emerald-600 font-bold">Synchronized in Real-Time</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Poll */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Real-Time Classroom Poll"
        subtitle="Students in this active session will receive this poll immediately."
      >
        <form onSubmit={handleCreatePoll} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Poll Question</label>
            <input
              type="text"
              required
              placeholder="e.g. Which architectural pattern should we implement for the next sprint?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = e.target.value;
                    setOptions(next);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                  placeholder={`Option ${i + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                type="button"
                onClick={() => setOptions([...options, `Option ${options.length + 1}`])}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                + Add Another Option
              </button>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25 cursor-pointer"
            >
              Broadcast Poll
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
