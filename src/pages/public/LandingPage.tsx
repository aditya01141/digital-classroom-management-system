import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Users,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  FolderGit2,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Cpu,
  Layers,
  Clock,
  HelpCircle,
  GitBranch,
  Play,
  FileText,
  Activity,
  Laptop,
} from 'lucide-react';
import { AIModeBadge } from '../../components/common/AIModeBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Public Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Digital<span className="text-blue-600">Classroom</span>
              </span>
              <p className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">
                Smarter Learning. Better Teaching.
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#ai-learning" className="hover:text-blue-600 transition-colors flex items-center gap-1 text-purple-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Learning</span>
            </a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">
              UML Architecture
            </a>
            <a href="#benefits" className="hover:text-blue-600 transition-colors">
              Benefits
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <AIModeBadge />
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2 & 3. Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Next-Generation EdTech Web Platform • College Project</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Your Entire Classroom, <span className="text-blue-600">Reimagined.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The <strong>Digital Classroom Management System (DCMS)</strong> connects teachers and students
            through a unified environment featuring live content sharing, automated attendance with device verification,
            sequential learning, interactive quizzes, and 7 built-in AI learning accelerators.
          </p>

          {/* 4. Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all hover:translate-y-[-1px]"
            >
              <span>Explore Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-xs transition-colors"
            >
              <span>Explore Features</span>
            </a>
            <Link
              to="/ai/workspace"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm border border-purple-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Try AI Tools</span>
            </Link>
          </div>

          {/* Preloaded Demo Accounts Banner */}
          <div className="mt-8 max-w-xl mx-auto bg-slate-100/80 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
            <div className="text-left">
              <span className="font-bold text-slate-800">Demo Logins Ready:</span>
              <span className="ml-2">Teacher: <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono">teacher@digitalclassroom.edu</code></span>
              <span className="ml-2">Student: <code className="bg-white px-1.5 py-0.5 rounded text-emerald-700 font-mono">student@digitalclassroom.edu</code></span>
            </div>
            <Link to="/login" className="text-blue-600 font-bold hover:underline shrink-0 ml-2">
              Auto-fill →
            </Link>
          </div>

          {/* 6. Product Dashboard Preview */}
          <div className="mt-12 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-300 shadow-2xl border border-slate-300">
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800 text-left">
              {/* Fake Browser Top Bar */}
              <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-300 ml-2">
                    https://digital-classroom.edu/teacher/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                    SESSION ACTIVE: CS-301
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-6 bg-slate-900 text-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400 font-medium">Verified Attendance</p>
                  <p className="text-2xl font-bold text-white mt-1">87.5%</p>
                  <p className="text-[11px] text-emerald-400 mt-1">7 of 8 Students Present</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400 font-medium">Pending Submissions</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">1 to Grade</p>
                  <p className="text-[11px] text-slate-400 mt-1">UML Assignment #1</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400 font-medium">Live Unresolved Doubts</p>
                  <p className="text-2xl font-bold text-rose-400 mt-1">2 Questions</p>
                  <p className="text-[11px] text-slate-400 mt-1">1 Hand Raised</p>
                </div>
                <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-800">
                  <p className="text-xs text-purple-300 font-medium">AI Teaching Assistant</p>
                  <p className="text-sm font-bold text-white mt-1">Class Summary Ready</p>
                  <p className="text-[11px] text-purple-300 mt-1">End-of-Class Synthesis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature Cards Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Core Capabilities</h2>
            <p className="text-3xl font-black text-slate-900 mt-2">
              Everything Your Classroom Needs in One Unified Portal
            </p>
            <p className="text-sm text-slate-500 mt-3">
              Engineered strictly to the specifications of the uploaded SRS requirements and UML diagrams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-5">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Attendance & Identity Verification</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Automated attendance recording on classroom join with simulated device fingerprinting and biometric
                handshake, preventing proxy attendance and enabling one-click CSV report export.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sequential Learning & Content Sharing</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Distribute notes, slide decks, diagrams, and video links. Prerequisite rules ensure students
                complete foundational steps before advanced topics unlock.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Quizzes, Assessments & Randomization</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Timed online assessments with question randomization, immediate score evaluation, and transparent
                anti-cheating window blur / tab detection logging.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-5">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Homework & Submission Review</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Structured homework portal allowing student file attachments and code responses, paired with a teacher
                grading interface for awarding marks and qualitative feedback.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Learning Suite (7 Features)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Study Assistant, Notes Summarizer, Quiz Generator, Flashcards, Doubt Explainer, Weakness Recommendations,
                and End-of-Class Summaries with live Gemini API or deterministic demo engine.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Performance Analytics & Summaries</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Classroom-wide accuracy, attendance percentages, weak topic detection, individual student learning curves,
                and exportable End-of-Class summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Classroom Lifecycle</h2>
            <p className="text-3xl font-black text-slate-900 mt-2">How It Works: The Complete Workflow</p>
            <p className="text-xs text-slate-500 mt-2">
              From class creation to session summary, mapped to the Sequence & Activity diagrams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-black text-blue-600/30 mb-2">01</div>
              <h4 className="text-base font-bold text-slate-900">Teacher Creates Class</h4>
              <p className="text-xs text-slate-600 mt-2">
                Instructor logs in, configures subject details, and the platform generates a unique join code (e.g., <code>SE-2026</code>).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-black text-blue-600/30 mb-2">02</div>
              <h4 className="text-base font-bold text-slate-900">Student Joins & Verifies</h4>
              <p className="text-xs text-slate-600 mt-2">
                Student enters code. The Verification Service verifies device and identity, logging attendance automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-black text-blue-600/30 mb-2">03</div>
              <h4 className="text-base font-bold text-slate-900">Learn, Note & Assess</h4>
              <p className="text-xs text-slate-600 mt-2">
                Students access sequential materials, participate in polls, take personal notes, raise hands, and submit assessments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-black text-blue-600/30 mb-2">04</div>
              <h4 className="text-base font-bold text-slate-900">Analyze & Summarize</h4>
              <p className="text-xs text-slate-600 mt-2">
                Teacher evaluates submissions, reviews integrity flags, and generates the AI End-of-Class Summary with CSV export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI-Powered Learning Section */}
      <section id="ai-learning" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Study & Teaching Accelerators</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              7 Dedicated AI Learning Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Configured with full support for Google Gemini API or deterministic offline demo simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-base font-bold text-purple-300">1. AI Study Assistant</h4>
              <p className="text-xs text-slate-300 mt-2">
                Interactive chat with markdown, code blocks, and diagrams answering computer science questions.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-base font-bold text-purple-300">2. Notes Summarizer</h4>
              <p className="text-xs text-slate-300 mt-2">
                Condenses dense lecture notes into bullet points, key terms, definitions, and exam checklists.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-base font-bold text-purple-300">3. Quiz Generator</h4>
              <p className="text-xs text-slate-300 mt-2">
                Generates multiple-choice questions by topic and difficulty, ready for one-click publishing into class tests.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-base font-bold text-purple-300">4. Interactive Flashcards</h4>
              <p className="text-xs text-slate-300 mt-2">
                Automated flashcard creation with answer flip, shuffle, and revision mode.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-base font-bold text-purple-300">5. Doubt Explainer</h4>
              <p className="text-xs text-slate-300 mt-2">
                Breaks down difficult concepts into simple analogies, step-by-step algorithms, and beginner-friendly code.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-base font-bold text-purple-300">6. Personalized Recommendations</h4>
              <p className="text-xs text-slate-300 mt-2">
                Diagnoses student quiz weaknesses and recommends exact study notes and practice tasks.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/ai/workspace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-600/30"
            >
              <span>Launch AI Learning Workspace</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Benefits for Teachers and Students */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Teachers */}
            <div className="bg-blue-50/60 p-8 rounded-3xl border border-blue-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-4">
                <span>For Course Instructors</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Save Time. Teach Intelligently.</h3>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Automated attendance with hardware token verification eliminates manual roll calls.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Real-time control over visible learning content and prerequisite activity unlocks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Centralized submission grading with custom mark rubrics and qualitative feedback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>AI End-of-Class summaries synthesize lecture metrics and weak topics in seconds.</span>
                </li>
              </ul>
            </div>

            {/* For Students */}
            <div className="bg-emerald-50/60 p-8 rounded-3xl border border-emerald-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
                <span>For Learners</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Engage Actively. Master Concepts.</h3>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Join class instantly with a 6-character code and seamless device check.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Built-in personal digital notes with search, tags, and text file export.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Raise digital hands and ask doubts without interrupting the whole lecture.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Personalized AI recommendations based on your actual assessment weak areas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 text-white font-black text-base">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span>Digital Classroom Management System (DCMS)</span>
              </div>
              <p className="mt-2 text-slate-400 max-w-md">
                A Software Engineering project developed by Aaditya Vyas, Devansh Jain, and Aarjav Jain.
                Constructed strictly following the SRS specifications and UML behavioral & structural models.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://github.com/aadityavyas/digital-classroom-management-system"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <GitBranch className="w-4 h-4 text-blue-400" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">System Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white">Teacher Login</Link></li>
                <li><Link to="/login" className="hover:text-white">Student Login</Link></li>
                <li><Link to="/ai/workspace" className="hover:text-white">AI Workspace</Link></li>
                <li><Link to="/analytics" className="hover:text-white">Performance Analytics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Architecture Spec</h4>
              <ul className="space-y-2">
                <li><span>Frontend: React 19 + TypeScript + Vite</span></li>
                <li><span>Styling: Tailwind CSS</span></li>
                <li><span>Backend Ready: Python Flask API Contract</span></li>
                <li><span>Database Schema: MySQL Relational Model</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Digital Classroom Management System (DCMS). Academic Software Engineering Project.</p>
            <p className="mt-2 sm:mt-0">Designed for Educational Excellence & Transparent Assessment Integrity</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
