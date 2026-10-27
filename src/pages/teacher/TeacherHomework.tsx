import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  Award,
  ExternalLink,
  Search,
  MessageSquare,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { Homework, Submission } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TeacherHomework: React.FC = () => {
  const { homeworks, submissions, classrooms, activeClassroom, createHomework, gradeSubmission } = useClassroom();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  // Form states for create
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMarks, setMaxMarks] = useState(50);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);

  // Form states for grading
  const [gradeMarks, setGradeMarks] = useState<number>(45);
  const [feedback, setFeedback] = useState('');

  const filteredHomeworks = homeworks.filter(
    (h) => selectedClassId === 'ALL' || h.classroomId === selectedClassId
  );

  const homeworkSubmissions = submissions.filter(
    (s) => s.targetType === 'homework' && (selectedClassId === 'ALL' || s.classroomId === selectedClassId)
  );

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createHomework({
      classroomId: selectedClassId === 'ALL' ? (activeClassroom?.id || 'cls_se_301') : selectedClassId,
      title: title.trim(),
      description: description.trim(),
      maxMarks: Number(maxMarks),
      dueDate,
      status: 'active',
      allowedFileTypes: ['pdf', 'zip'],
    });

    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  const handleOpenGrading = (sub: Submission) => {
    setGradingSubmission(sub);
    setGradeMarks(sub.marksObtained !== undefined ? sub.marksObtained : Math.round(sub.maxMarks * 0.9));
    setFeedback(sub.feedback || 'Good work! Ensure all UML notations strictly adhere to OMG 2.5 specifications.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    gradeSubmission(gradingSubmission.id, Number(gradeMarks), feedback.trim());
    setGradingSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Homework & Assessment Grading</h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign problem sets, inspect student code and deliverables, and return verified feedback.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Homework Assignment</span>
        </button>
      </div>

      {/* Classroom filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Filter Classroom:</span>
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

        <Badge variant="amber" size="sm">
          {homeworkSubmissions.filter((s) => s.status === 'submitted').length} Pending Grading
        </Badge>
      </div>

      {/* Submissions Review Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Deliverables & Submissions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click "Evaluate" to review work and assign grades.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-4">Assignment Title</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4">Attachment / Notes</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {homeworkSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No submissions recorded for this assignment filter.
                  </td>
                </tr>
              ) : (
                homeworkSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                      {sub.targetTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{sub.submittedAt}</td>
                    <td className="py-3.5 px-4">
                      {sub.fileName ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{sub.fileName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Direct Text</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {sub.marksObtained !== undefined ? (
                        <span className="text-emerald-700">
                          {sub.marksObtained} / {sub.maxMarks}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">— / {sub.maxMarks}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={sub.status === 'graded' ? 'success' : 'warning'} size="sm">
                        {sub.status === 'graded' ? 'Evaluated' : 'Needs Grading'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleOpenGrading(sub)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          sub.status === 'graded'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        }`}
                      >
                        {sub.status === 'graded' ? 'Re-evaluate' : 'Evaluate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Homework */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Assign New Homework"
        subtitle="Specify deadline, rubric description, and allowed file formats."
      >
        <form onSubmit={handleCreateHomework} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Homework Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Assignment 2: Database Normalization (3NF & BCNF)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Marks</label>
              <input
                type="number"
                min={10}
                max={100}
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Submission Deadline</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Description & Rubric</label>
            <textarea
              rows={4}
              placeholder="Detailed guidelines, reference questions, and expected deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Post Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Grade Submission */}
      <Modal
        isOpen={Boolean(gradingSubmission)}
        onClose={() => setGradingSubmission(null)}
        title="Evaluate Student Submission"
        subtitle={`Student: ${gradingSubmission?.studentName} • Assignment: ${gradingSubmission?.targetTitle}`}
      >
        {gradingSubmission && (
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-900">Student Submitted Content:</p>
              <p className="text-slate-700 leading-relaxed italic">{gradingSubmission.content || 'Attached file only.'}</p>
              {gradingSubmission.fileName && (
                <div className="mt-2 flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>{gradingSubmission.fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Validated File Attachment</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Marks Obtained (Max: {gradingSubmission.maxMarks})
              </label>
              <input
                type="number"
                min={0}
                max={gradingSubmission.maxMarks}
                required
                value={gradeMarks}
                onChange={(e) => setGradeMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Feedback & Remarks</label>
              <textarea
                rows={3}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Constructive feedback on strengths and improvement areas..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                Save Grade & Feedback
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
