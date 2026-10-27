import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { Submission } from '../../types';

export const TakeQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { quizzes, submissions, submitQuiz, logIntegrityEvent } = useClassroom();
  const { user } = useAuth();
  const navigate = useNavigate();

  const quiz = quizzes.find((q) => q.id === id);
  const existingSub = submissions.find(
    (s) => s.targetId === id && s.studentId === (user?.id || 'usr_student_01')
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>((quiz?.timeLimitMinutes || 10) * 60);
  const [tabWarning, setTabWarning] = useState<string | null>(null);
  const [integrityNotes, setIntegrityNotes] = useState<string[]>([]);
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(existingSub || null);

  // Timer countdown
  useEffect(() => {
    if (submittedResult || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submittedResult, timeLeft]);

  // Tab switch & focus loss detection (FR-11)
  useEffect(() => {
    if (submittedResult) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const note = `Window/tab switch detected at ${new Date().toLocaleTimeString()} (Active exam duration).`;
        setTabWarning('Anti-Cheating Telemetry: Exam tab lost focus. Event logged for instructor review.');
        setIntegrityNotes((prev) => [...prev, note]);

        if (quiz && user) {
          logIntegrityEvent({
            classroomId: quiz.classroomId,
            studentId: user.id,
            studentName: user.name,
            activityTitle: quiz.title,
            eventType: 'TAB_SWITCH',
            severity: 'medium',
            details: `Candidate switched browser tabs while taking "${quiz.title}".`,
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [submittedResult, quiz, user]);

  const handleSelectOption = (questionId: string, option: string) => {
    if (submittedResult) return;
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quiz || !user || submittedResult) return;

    const sub = submitQuiz(
      quiz.id,
      quiz.classroomId,
      user.id,
      user.name,
      answers,
      integrityNotes
    );
    setSubmittedResult(sub);
  };

  if (!quiz) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Quiz not found.{' '}
        <Link to="/student/quizzes" className="text-blue-600 underline">
          Back to quizzes
        </Link>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{quiz.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Student: <strong>{user?.name}</strong> • Max Marks: {quiz.maxMarks} • {quiz.questions.length} Questions
          </p>
        </div>

        {!submittedResult && (
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold shrink-0 shadow-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Time Left: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Tab switch warning alert */}
      {tabWarning && !submittedResult && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Transparent Monitoring Alert (FR-11):</p>
            <p className="text-[11px] text-amber-800 mt-0.5">{tabWarning}</p>
          </div>
        </div>
      )}

      {/* If already submitted: Result Card */}
      {submittedResult && (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-700 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Assessment Evaluated
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Score: {submittedResult.marksObtained} / {submittedResult.maxMarks} Marks
              </h2>
            </div>
          </div>

          <p className="text-xs text-blue-100 leading-relaxed bg-white/10 p-3.5 rounded-xl border border-white/10">
            {submittedResult.feedback || 'Automated assessment evaluation completed.'}
          </p>

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-blue-300">Submitted at: {submittedResult.submittedAt}</span>
            <Link
              to="/student/quizzes"
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-bold hover:bg-blue-50 transition-colors shadow-xs"
            >
              Back to Assessments
            </Link>
          </div>
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {quiz.questions.map((q, idx) => {
          const selectedOption = submittedResult ? submittedResult.answers?.[q.id] : answers[q.id];
          const isCorrect = submittedResult && selectedOption === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                submittedResult
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Question {idx + 1}
                </span>
                <span className="font-semibold text-slate-500">{q.marks} Marks</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{q.questionText}</h3>

              {/* Options */}
              <div className="mt-4 space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isChosen = selectedOption === opt;
                  const isCorrectAnswer = submittedResult && opt === q.correctAnswer;

                  return (
                    <label
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isChosen
                          ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-950 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                      } ${submittedResult ? 'cursor-default pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          checked={isChosen}
                          onChange={() => handleSelectOption(q.id, opt)}
                          disabled={Boolean(submittedResult)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{opt}</span>
                      </div>
                      {isCorrectAnswer && (
                        <span className="text-emerald-700 font-extrabold text-[11px]">
                          ✓ Correct Key
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {submittedResult && q.explanation && (
                <div className="mt-4 p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800">Explanation: </strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {!submittedResult && (
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Assessment Answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
