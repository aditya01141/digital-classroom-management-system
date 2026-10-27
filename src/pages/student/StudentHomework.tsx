import React, { useState } from 'react';
import {
  FolderGit2,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  Award,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Homework, Submission } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const StudentHomework: React.FC = () => {
  const { homeworks, submissions, submitHomework } = useClassroom();
  const { user } = useAuth();

  const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [fileName, setFileName] = useState('');

  const studentSubmissions = submissions.filter(
    (s) => s.studentId === (user?.id || 'usr_student_01') && s.targetType === 'homework'
  );

  const handleOpenSubmit = (hw: Homework) => {
    setSelectedHw(hw);
    setSubmissionContent('');
    setFileName(`${user?.name.replace(/\s+/g, '_')}_${hw.title.slice(0, 15).replace(/\s+/g, '_')}.pdf`);
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw || !user) return;

    submitHomework(
      selectedHw.id,
      selectedHw.classroomId,
      user.id,
      user.name,
      submissionContent.trim() || 'Deliverable uploaded and verified by client browser.',
      fileName
    );

    setSelectedHw(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Homework & Problem Sets</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review assignments, submit project deliverables, and track teacher marks and qualitative feedback.
        </p>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeworks.map((hw) => {
          const sub = studentSubmissions.find((s) => s.targetId === hw.id);

          return (
            <div
              key={hw.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 uppercase">
                    Assignment
                  </span>
                  <Badge variant={sub ? (sub.status === 'graded' ? 'success' : 'primary') : 'warning'} size="sm">
                    {sub ? (sub.status === 'graded' ? 'Evaluated' : 'Submitted') : 'Pending'}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{hw.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{hw.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: <strong>{hw.dueDate}</strong></span>
                  </div>
                  <span>Max Marks: <strong>{hw.maxMarks}</strong></span>
                </div>

                {/* Evaluated Marks Banner */}
                {sub?.status === 'graded' && sub.marksObtained !== undefined && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>Awarded Marks:</span>
                      <span className="text-base text-emerald-800">
                        {sub.marksObtained} / {sub.maxMarks}
                      </span>
                    </div>
                    {sub.feedback && (
                      <p className="text-emerald-700 text-[11px] mt-1 pt-1 border-t border-emerald-200/60">
                        <strong>Teacher Feedback:</strong> "{sub.feedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Submitted but pending review */}
                {sub?.status === 'submitted' && (
                  <div className="mt-4 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Deliverable Submitted at {sub.submittedAt}</span>
                    </p>
                    {sub.fileName && (
                      <p className="font-mono text-[11px] text-blue-700 mt-1">File: {sub.fileName}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                {!sub ? (
                  <button
                    onClick={() => handleOpenSubmit(hw)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenSubmit(hw)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Resubmit Deliverable
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Submit Homework */}
      <Modal
        isOpen={Boolean(selectedHw)}
        onClose={() => setSelectedHw(null)}
        title="Submit Homework Deliverable"
        subtitle={`Assignment: ${selectedHw?.title} • Max Marks: ${selectedHw?.maxMarks}`}
      >
        {selectedHw && (
          <form onSubmit={handleSaveSubmission} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Solution Write-up / GitHub Repo Link / Explanation
              </label>
              <textarea
                rows={4}
                required
                placeholder="Provide notes, diagram explanations, methodology or code repository link..."
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach Deliverable Document / PDF Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Student_Assignment.pdf"
                className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Simulated file storage upload adapter (supports PDF, PNG, ZIP deliverables).
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedHw(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 cursor-pointer"
              >
                Confirm Submission
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
