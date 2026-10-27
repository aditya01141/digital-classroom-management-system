import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Plus,
  Clock,
  Sparkles,
  Users,
  Award,
  Eye,
  CheckCircle2,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { Quiz, QuizQuestion } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TeacherQuizzes: React.FC = () => {
  const { quizzes, classrooms, activeClassroom, submissions, createQuiz } = useClassroom();
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassroom?.id || 'cls_se_301');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuizDetails, setSelectedQuizDetails] = useState<Quiz | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_new_1',
      questionText: 'What is the primary role of a Deployment Diagram?',
      type: 'MCQ',
      options: ['Mapping software to hardware nodes', 'Drawing class relationships', 'Tracking unit tests', 'Creating UI wireframes'],
      correctAnswer: 'Mapping software to hardware nodes',
      marks: 5,
    },
    {
      id: 'q_new_2',
      questionText: 'Which principle ensures classes are open for extension but closed for modification?',
      type: 'MCQ',
      options: ['Open-Closed Principle', 'Single Responsibility', 'Liskov Substitution', 'Interface Segregation'],
      correctAnswer: 'Open-Closed Principle',
      marks: 5,
    },
  ]);

  const filteredQuizzes = quizzes.filter(
    (q) => selectedClassId === 'ALL' || q.classroomId === selectedClassId
  );

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    createQuiz({
      classroomId: selectedClassId === 'ALL' ? (activeClassroom?.id || 'cls_se_301') : selectedClassId,
      title: title.trim(),
      description: description.trim(),
      timeLimitMinutes: Number(timeLimit),
      questions,
      status: 'published',
      maxMarks: totalMarks,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const getSubmissionsForQuiz = (quizId: string) => {
    return submissions.filter((s) => s.targetId === quizId && s.targetType === 'quiz');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quizzes & Online Assessments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure timed assessments, randomized question banks, and automated grading rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/ai/workspace"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Quiz Generator</span>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quiz</span>
          </button>
        </div>
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
            <option value="ALL">All Enrolled Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <Badge variant="success" size="sm">
          {filteredQuizzes.length} Published Quizzes
        </Badge>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => {
          const quizSubs = getSubmissionsForQuiz(quiz.id);
          const avgScore =
            quizSubs.length > 0
              ? Math.round(
                  quizSubs.reduce((acc, s) => acc + (s.marksObtained || 0), 0) / quizSubs.length
                )
              : 0;

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Assessment</span>
                  </div>
                  <Badge variant={quiz.status === 'published' ? 'success' : 'slate'} size="sm">
                    {quiz.status.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{quiz.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{quiz.description}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Limit</span>
                    <span className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {quiz.timeLimitMinutes} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Marks</span>
                    <span className="font-bold text-blue-600 mt-0.5 block">{quiz.maxMarks} pts</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Submissions</span>
                    <span className="font-bold text-emerald-600 mt-0.5 block">{quizSubs.length}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Questions: <strong>{quiz.questions.length} MCQs</strong></span>
                  <span>Class Average: <strong>{avgScore} / {quiz.maxMarks}</strong></span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedQuizDetails(quiz)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Questions & Scoring</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Quiz */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Classroom Assessment"
        subtitle="Questions are automatically randomized per student to uphold assessment integrity."
      >
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Unit 3: Design Patterns & Architectural Boundaries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Description</label>
            <textarea
              rows={2}
              placeholder="Guidelines for students during the timed session..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Limit (Minutes)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Randomize Question Order</label>
              <div className="flex items-center gap-2 h-10 px-3 border border-slate-300 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700">
                <input type="checkbox" defaultChecked disabled className="rounded text-blue-600" />
                <span>Enabled (FR-11)</span>
              </div>
            </div>
          </div>

          {/* Configured questions preview */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Configured Questions ({questions.length})</label>
              <span className="text-[11px] text-blue-600 font-bold">Total: {questions.reduce((a, b) => a + b.marks, 0)} marks</span>
            </div>
            {questions.map((q, idx) => (
              <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">
                  {idx + 1}. {q.questionText} ({q.marks} marks)
                </p>
                <p className="text-slate-500 text-[11px]">
                  Correct Answer: <strong className="text-emerald-700">{q.correctAnswer}</strong>
                </p>
              </div>
            ))}
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
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Publish Assessment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Details */}
      <Modal
        isOpen={Boolean(selectedQuizDetails)}
        onClose={() => setSelectedQuizDetails(null)}
        title={selectedQuizDetails?.title || 'Assessment Details'}
        subtitle={`Time Limit: ${selectedQuizDetails?.timeLimitMinutes} mins • Max Marks: ${selectedQuizDetails?.maxMarks}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">{selectedQuizDetails?.description}</p>

          <div className="space-y-3">
            {selectedQuizDetails?.questions.map((q, i) => (
              <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Question {i + 1}: {q.questionText}</span>
                  <Badge variant="primary" size="sm">{q.marks} marks</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border ${
                        opt === q.correctAnswer
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {opt} {opt === q.correctAnswer && '✓ (Key)'}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="text-[11px] text-slate-500 italic mt-1">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setSelectedQuizDetails(null)}
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
