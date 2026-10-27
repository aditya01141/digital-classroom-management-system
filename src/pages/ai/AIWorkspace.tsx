import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  FileText,
  FileCheck2,
  Layers,
  HelpCircle,
  TrendingUp,
  Cpu,
  Send,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  Download,
  BookOpen,
} from 'lucide-react';
import { aiService, GeneratedQuizItem, GeneratedFlashcard, AIRecommendation } from '../../services/aiService';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { AIModeBadge } from '../../components/common/AIModeBadge';
import { Badge } from '../../components/common/Badge';

export const AIWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'chat' | 'summarizer' | 'quiz_gen' | 'flashcards' | 'explainer' | 'recommendations' | 'class_summary'
  >('chat');

  const { activeClassroom, createQuiz } = useClassroom();
  const { user, role } = useAuth();

  // Tab 1: Chat Assistant State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string; isDemo?: boolean }[]
  >([
    {
      sender: 'ai',
      text: 'Hello! I am your **Digital Classroom AI Learning Assistant**. Ask me anything about Software Engineering, UML Diagrams, Relational Databases, or system design principles!',
      time: '10:00 AM',
      isDemo: !aiService.isConfigured,
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Tab 2: Summarizer State
  const [notesInput, setNotesInput] = useState(
    `A Sequence Diagram is an interaction diagram that details how operations are carried out—what messages are sent and when. Sequence diagrams are organized according to time. The time progresses as you go down the page. The actors and objects involved are listed from left to right along the top. An alt fragment handles conditional logic (if-then-else) while an opt fragment represents optional execution.`
  );
  const [summaryResult, setSummaryResult] = useState<{
    summary: string;
    keyPoints: string[];
    definitions: { term: string; def: string }[];
    revisionChecklist: string[];
  } | null>(null);
  const [summarizerLoading, setSummarizerLoading] = useState(false);

  // Tab 3: Quiz Generator State
  const [quizTopic, setQuizTopic] = useState('UML Sequence & Component Diagrams');
  const [quizDifficulty, setQuizDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [quizCount, setQuizCount] = useState(3);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuizItem[]>([]);
  const [quizGenLoading, setQuizGenLoading] = useState(false);
  const [quizSavedAlert, setQuizSavedAlert] = useState(false);

  // Tab 4: Flashcards State
  const [flashcardSource, setFlashcardSource] = useState(
    `Structural diagrams model static aspects (Class, Component, Deployment). Behavioral diagrams model dynamic behavior over time (Sequence, Activity, State). The Identity Verification Service checks hardware tokens to eliminate proxy attendance.`
  );
  const [flashcards, setFlashcards] = useState<GeneratedFlashcard[]>([
    {
      category: 'UML & Modeling',
      question: 'What is the primary purpose of a Sequence Diagram?',
      answer: 'To depict temporal message exchanges between interacting lifelines and system actors over time.',
    },
    {
      category: 'Software Architecture',
      question: 'What is the Dependency Inversion Principle (DIP)?',
      answer: 'High-level business policies should not depend on low-level infrastructure details; both must depend on abstractions.',
    },
    {
      category: 'Academic Integrity',
      question: 'How should student blur signals be evaluated?',
      answer: 'As signals for human instructor review, not as automated proof of cheating.',
    },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);

  // Tab 5: Doubt Explainer State
  const [doubtQuery, setDoubtQuery] = useState(
    'Why does the system verify the student device before recording attendance in the sequence diagram?'
  );
  const [explainerLevel, setExplainerLevel] = useState<'Beginner' | 'Deep Dive'>('Beginner');
  const [explainerResult, setExplainerResult] = useState<{
    stepByStep: string[];
    simpleAnalogy: string;
    codeOrFormulaExample: string;
  } | null>(null);
  const [explainerLoading, setExplainerLoading] = useState(false);

  // Tab 6: Recommendations State
  const [recs, setRecs] = useState<AIRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  // Tab 7: Class Summary State
  const [classSummaryResult, setClassSummaryResult] = useState<{
    executiveSummary: string;
    keyHighlights: string[];
    weakAreas: string[];
    actionableNextSteps: string[];
  } | null>(null);
  const [classSummaryLoading, setClassSummaryLoading] = useState(false);

  // ---------------- Handlers ----------------

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user' as const, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await aiService.askStudyAssistant(userMsg.text);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: res.isDemoMode,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!notesInput.trim()) return;
    setSummarizerLoading(true);
    try {
      const res = await aiService.summarizeNotes(notesInput);
      setSummaryResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSummarizerLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizGenLoading(true);
    try {
      const res = await aiService.generateQuiz(quizTopic, quizDifficulty, quizCount);
      setGeneratedQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setQuizGenLoading(false);
    }
  };

  const handlePublishGeneratedQuiz = () => {
    if (generatedQuestions.length === 0) return;
    createQuiz({
      classroomId: activeClassroom?.id || 'cls_se_301',
      title: `AI-Generated Assessment: ${quizTopic}`,
      description: `Automated assessment generated at ${quizDifficulty} difficulty level.`,
      timeLimitMinutes: 10,
      status: 'published',
      maxMarks: generatedQuestions.length * 5,
      questions: generatedQuestions.map((q, idx) => ({
        id: `gen_q_${idx + 1}`,
        questionText: q.questionText,
        type: 'MCQ',
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: 5,
        explanation: q.explanation,
      })),
    });
    setQuizSavedAlert(true);
    setTimeout(() => setQuizSavedAlert(false), 3000);
  };

  const handleGenerateFlashcards = async () => {
    if (!flashcardSource.trim()) return;
    setFlashcardsLoading(true);
    try {
      const res = await aiService.generateFlashcards(flashcardSource);
      setFlashcards(res.data);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFlashcardsLoading(false);
    }
  };

  const handleExplainDoubt = async () => {
    if (!doubtQuery.trim()) return;
    setExplainerLoading(true);
    try {
      const res = await aiService.explainDoubt(doubtQuery, explainerLevel);
      setExplainerResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setExplainerLoading(false);
    }
  };

  const handleLoadRecs = async () => {
    setRecsLoading(true);
    try {
      const res = await aiService.getPersonalizedRecommendations(
        user?.name || 'Rohan Verma',
        ['UML Aggregation vs Composition Semantics', 'Database Concurrency & 2-Phase Locking']
      );
      setRecs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRecsLoading(false);
    }
  };

  const handleGenerateClassSummary = async () => {
    setClassSummaryLoading(true);
    try {
      const res = await aiService.generateEndOfClassSummary({
        className: activeClassroom?.title || 'Advanced Software Engineering',
        topic: activeClassroom?.currentTopic || 'UML Sequence & Component Diagrams',
        attendancePresent: 7,
        attendanceTotal: 8,
        quizAvg: 18,
        openDoubts: 2,
      });
      setClassSummaryResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setClassSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2.5 bg-purple-600 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">AI Learning Accelerator Suite</h1>
          </div>
          <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
            7 specialized EdTech modules engineered for conceptual mastery, exam preparation, and pedagogical intelligence.
            Supports live Google Gemini API or deterministic demo simulation.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <AIModeBadge />
          <span className="text-[10px] text-purple-300 font-mono">
            {aiService.isConfigured ? 'Live LLM Provider: Google Gemini' : 'Operating in Safe Demo Mode'}
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'chat', label: '1. Study Assistant', icon: MessageSquare },
          { id: 'summarizer', label: '2. Notes Summarizer', icon: FileText },
          { id: 'quiz_gen', label: '3. Quiz Generator', icon: FileCheck2 },
          { id: 'flashcards', label: '4. Flashcards', icon: Layers },
          { id: 'explainer', label: '5. Doubt Explainer', icon: HelpCircle },
          { id: 'recommendations', label: '6. Recommendations', icon: TrendingUp },
          { id: 'class_summary', label: '7. Class Summary', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB 1: AI Study Assistant ---------------- */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
          {/* Chat message stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider opacity-75">
                      {msg.sender === 'user' ? 'You' : 'AI Tutor'}
                    </span>
                    <span className="text-[10px] opacity-60">{msg.time}</span>
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3 text-xs items-center text-purple-600">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span className="font-bold">AI Assistant is thinking...</span>
              </div>
            )}
          </div>

          {/* Prompt pills */}
          <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Try asking:</span>
            {[
              'Explain Sequence Diagrams with an example',
              'What are the 4 ACID properties in SQL?',
              'Difference between Aggregation and Composition',
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setChatInput(p)}
                className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 whitespace-nowrap cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              required
              placeholder="Type your question about programming, algorithms, or UML..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      )}

      {/* ---------------- TAB 2: Notes Summarizer ---------------- */}
      {activeTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Lecture Material Input</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste raw study notes or chapter content to condense into structured revision points.
              </p>
            </div>
            <textarea
              rows={12}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 outline-hidden leading-relaxed"
            />
            <button
              onClick={handleSummarize}
              disabled={summarizerLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{summarizerLoading ? 'Summarizing Content...' : 'Generate AI Summary'}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Synthesized Knowledge</h3>
              <AIModeBadge />
            </div>

            {summaryResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-purple-900 uppercase tracking-wider text-[11px] mb-1">
                    Executive Summary:
                  </h4>
                  <p className="text-slate-700 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 leading-relaxed font-medium">
                    {summaryResult.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                    Key Conceptual Points:
                  </h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {summaryResult.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {summaryResult.definitions && (
                  <div>
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Core Definitions:
                    </h4>
                    <div className="space-y-2">
                      {summaryResult.definitions.map((d, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-blue-700">{d.term}:</strong> {d.def}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400">
                Click "Generate AI Summary" to view distilled key points and definitions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: AI Quiz Generator ---------------- */}
      {activeTab === 'quiz_gen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">AI Assessment Generator</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter any technical topic and generate exam-ready multiple-choice questions with answer keys.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Syllabus Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Difficulty</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Count</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={quizCount}
                  onChange={(e) => setQuizCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateQuiz}
                disabled={quizGenLoading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{quizGenLoading ? 'Generating Questions...' : 'Generate Questions'}</span>
              </button>
            </div>
          </div>

          {quizSavedAlert && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Assessment published successfully into the classroom assessment schedule!</span>
            </div>
          )}

          {generatedQuestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Generated Questions ({generatedQuestions.length})
                </h3>
                {role === 'teacher' && (
                  <button
                    onClick={handlePublishGeneratedQuiz}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish as Live Quiz</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{idx + 1}. {q.questionText}</span>
                      <Badge variant="purple" size="sm">5 Marks</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border ${
                            opt === q.correctAnswer
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          {opt} {opt === q.correctAnswer && '✓ (Correct)'}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-500 italic">
                        <strong>Rationale:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 4: Interactive Flashcards ---------------- */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Study Source for Flashcards</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={flashcardSource}
                onChange={(e) => setFlashcardSource(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden"
              />
              <button
                onClick={handleGenerateFlashcards}
                disabled={flashcardsLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Cards</span>
              </button>
            </div>
          </div>

          {/* Flashcard Flip Display */}
          {flashcards.length > 0 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="h-64 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl border border-purple-700 flex flex-col justify-between cursor-pointer select-none transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between text-xs text-purple-200">
                  <span className="font-bold uppercase tracking-wider">
                    {flashcards[currentCardIndex]?.category}
                  </span>
                  <span className="text-[10px] bg-purple-800/60 px-2 py-0.5 rounded">
                    Click anywhere to flip
                  </span>
                </div>

                <div className="text-center py-4">
                  <span className="text-[11px] font-bold text-purple-300 block mb-2 uppercase">
                    {isFlipped ? 'Answer / Solution' : 'Question / Concept'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold leading-relaxed">
                    {isFlipped
                      ? flashcards[currentCardIndex]?.answer
                      : flashcards[currentCardIndex]?.question}
                  </h3>
                </div>

                <div className="text-center text-xs text-purple-300">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
                    setFlashcards(shuffled);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center gap-1 hover:bg-purple-100 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle Deck</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 5: AI Doubt Explainer ---------------- */}
      {activeTab === 'explainer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Question or Coding Doubt</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Break down challenging topics using intuitive metaphors and code algorithms.
              </p>
            </div>

            <textarea
              rows={4}
              value={doubtQuery}
              onChange={(e) => setDoubtQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Explanation Depth</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setExplainerLevel('Beginner')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    explainerLevel === 'Beginner'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Beginner Friendly (Analogy)
                </button>
                <button
                  onClick={() => setExplainerLevel('Deep Dive')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    explainerLevel === 'Deep Dive'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Deep Technical Dive
                </button>
              </div>
            </div>

            <button
              onClick={handleExplainDoubt}
              disabled={explainerLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{explainerLoading ? 'Deconstructing Question...' : 'Explain Step-by-Step'}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step-by-Step Pedagogical Explanation
            </h3>

            {explainerResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900">
                  <strong className="block mb-1 text-[11px] uppercase tracking-wider text-amber-800">
                    💡 Real-World Metaphor / Analogy:
                  </strong>
                  <p className="leading-relaxed">{explainerResult.simpleAnalogy}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Step-by-Step Concept Breakdown:</h4>
                  <div className="space-y-2">
                    {explainerResult.stepByStep.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {explainerResult.codeOrFormulaExample && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Code / Implementation Example:</h4>
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
                      {explainerResult.codeOrFormulaExample}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400">
                Click "Explain Step-by-Step" to generate an intuitive breakdown.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 6: AI Personalized Recommendations ---------------- */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Personalized Learning Diagnostics</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyzes quiz mistakes and missed homework rubrics to recommend custom practice tasks.
              </p>
            </div>
            <button
              onClick={handleLoadRecs}
              disabled={recsLoading}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{recsLoading ? 'Analyzing Performance...' : 'Run Diagnostics'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(recs.length > 0
              ? recs
              : [
                  {
                    topic: 'Aggregation vs Composition in UML',
                    priority: 'High' as const,
                    reason: 'Missed in Mid-Module Assessment Question 2.',
                    suggestedAction: 'Review Lecture 04 Study Notes, section 1.1 on diamond relationships.',
                  },
                  {
                    topic: 'ACID Isolation Anomalies',
                    priority: 'Medium' as const,
                    reason: 'Identified as general class review topic.',
                    suggestedAction: 'Attempt the ACID practice quiz and review slide deck #3.',
                  },
                  {
                    topic: 'Activity Diagram Partitions',
                    priority: 'Low' as const,
                    reason: 'Minor layout feedback provided on actor partitions.',
                    suggestedAction: 'Reference standard OMG UML 2.5 sample partition guide.',
                  },
                ]
            ).map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-400">Diagnosis</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">{item.topic}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.reason}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Action:</span>
                  <p className="text-purple-700 font-semibold text-[11px] mt-0.5">{item.suggestedAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 7: AI End-of-Class Summary ---------------- */}
      {activeTab === 'class_summary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">End-of-Class Pedagogical Summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Summarizes lecture coverage, attendance metrics, quiz averages, and homework assigned.
              </p>
            </div>
            <button
              onClick={handleGenerateClassSummary}
              disabled={classSummaryLoading}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{classSummaryLoading ? 'Synthesizing...' : 'Generate AI Summary'}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
                Executive Overview:
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                {classSummaryResult?.executiveSummary ||
                  `Today's session for "Advanced Software Engineering" on "UML Sequence & Component Diagrams" concluded with 87.5% attendance and an average quiz performance of 18/20 marks.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block">
                  Identified Weak Topics:
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {(
                    classSummaryResult?.weakAreas || [
                      'Differentiating strong aggregation from weak aggregation in class diagrams.',
                      'Handling exception rollback in distributed sequence fragments.',
                    ]
                  ).map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px] block">
                  Instructor Next Steps:
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {(
                    classSummaryResult?.actionableNextSteps || [
                      'Address the 2 open questions in the live doubt queue.',
                      'Review the 1 submitted homework deliverable.',
                      'Unlock the next sequential learning topic.',
                    ]
                  ).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
