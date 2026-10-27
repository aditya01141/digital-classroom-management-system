import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

export const StudentQuizzes: React.FC = () => {
  const { quizzes, submissions } = useClassroom();
  const { user } = useAuth();

  const publishedQuizzes = quizzes.filter((q) => q.status === 'published');
  const studentSubs = submissions.filter(
    (s) => s.studentId === (user?.id || 'usr_student_01') && s.targetType === 'quiz'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quizzes & Online Assessments</h1>
        <p className="text-xs text-slate-500 mt-1">
          Take timed assessments, test your conceptual knowledge, and review evaluated results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishedQuizzes.map((quiz) => {
          const submission = studentSubs.find((s) => s.targetId === quiz.id);

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
                  <Badge variant={submission ? 'success' : 'warning'} size="sm">
                    {submission ? 'Completed' : 'Ready to Take'}
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Questions</span>
                    <span className="font-bold text-blue-600 mt-0.5 block">{quiz.questions.length} MCQs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Marks</span>
                    <span className="font-bold text-emerald-600 mt-0.5 block">{quiz.maxMarks} pts</span>
                  </div>
                </div>

                {submission && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>My Score:</span>
                      <span>
                        {submission.marksObtained} / {submission.maxMarks} (
                        {Math.round(((submission.marksObtained || 0) / submission.maxMarks) * 100)}%)
                      </span>
                    </div>
                    {submission.feedback && (
                      <p className="text-emerald-700 text-[11px] mt-1">{submission.feedback}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Due: {quiz.dueDate || 'Open'}</span>

                <Link
                  to={`/student/quizzes/${quiz.id}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
                    submission
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>{submission ? 'Review Answers' : 'Attempt Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
