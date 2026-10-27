# Digital Classroom Management System (DCMS)
> **Smarter Learning. Better Teaching.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)]()
[![Tests](https://img.shields.io/badge/Tests-18%20Passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![React](https://img.shields.io/badge/React-19-cyan.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-purple.svg)]()

A complete, responsive, full-featured web-based EdTech platform engineered strictly according to the Software Engineering **SRS Report** and formal **UML Models** (Use Case, Class, Component, Deployment, Sequence, Collaboration, State, Activity, and DFD Levels 0–2).

**Project Authors:** Aaditya Vyas • Devansh Jain • Aarjav Jain  
**Academic Domain:** Educational Technology (EdTech) / E-Learning  

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [SRS & UML Traceability Matrix](#srs--uml-traceability-matrix)
3. [Technology Stack & Architecture](#technology-stack--architecture)
4. [Pre-configured Demo Accounts](#pre-configured-demo-accounts)
5. [Core End-to-End Workflows](#core-end-to-end-workflows)
6. [AI Learning Assistant Suite (7 Modules)](#ai-learning-assistant-suite-7-modules)
7. [Academic Integrity & Consent-Based Monitoring](#academic-integrity--consent-based-monitoring)
8. [Automated Test Suite (Vitest)](#automated-test-suite-vitest)
9. [Installation & Local Execution](#installation--local-execution)
10. [GitHub Repository Setup Commands](#github-repository-setup-commands)
11. [Public Deployment Instructions (Vercel & Netlify)](#public-deployment-instructions-vercel--netlify)

---

## 1. Project Overview

Traditional classrooms frequently suffer from manual attendance overhead, delayed evaluation feedback, fragmented learning materials, and proxy attendance. The **Digital Classroom Management System (DCMS)** transforms this environment into a unified digital workspace where:
- **Teachers** broadcast live lectures, control content visibility, unlock sequential activities, conduct interactive polls, evaluate homework with rubrics, review academic integrity flags, and generate automated AI session summaries.
- **Students** join via 6-character course codes, authenticate their device hardware fingerprint, access study materials sequentially, take digital markdown notes, raise digital hands in real-time, submit assignments, and take timed anti-cheat assessments.
- **External Verification Service** validates device environment tokens to ensure attendance idempotency and eliminate proxy check-ins.

---

## 2. SRS & UML Traceability Matrix

| Requirement / UML Diagram | System Module | Functional Behavior | Implemented Route / Component |
| :--- | :--- | :--- | :--- |
| **FR-01: Real-Time Content Sharing** | Content Management | Upload & distribute notes, slide decks, images, video links | `/teacher/materials`, `/student/materials` |
| **FR-02: Content Control** | Session Controller | Teacher controls which lecture topic and materials students can view | `/classrooms/:id`, `LiveSessionController` |
| **FR-03: Interactive Questions** | Real-Time Polling | On-the-fly questions and live vote progress bars | `/teacher/polls`, `/student/classrooms/:id` |
| **FR-04: Sequential Learning** | Progression Pipeline | Next milestone unlocks only upon completion of prerequisite step | `StudentClassroomView.tsx` |
| **FR-05: Attendance Verification** | Attendance Store | Device fingerprint + biometric verification token on session join | `/teacher/attendance`, `/student/join` |
| **FR-06: Teacher Dashboard** | Dashboard Hub | Metrics: total students, live sessions, attendance %, submissions | `/teacher/dashboard` |
| **FR-07: Digital Notes** | Student Workspace | Create, search, tag, persist to localStorage, and export as `.txt` | `/student/notes` |
| **FR-08: Doubt & Raise Hand** | Doubt Queue | Student raises digital hand; teacher resolves inquiry in real-time | `/teacher/doubts`, `/student/doubts` |
| **FR-09 & FR-10: Quizzes & Homework** | Assessment Engine | Timed assessments, randomized questions, homework file upload | `/teacher/quizzes`, `/student/quizzes/:id` |
| **FR-11: Academic Integrity** | Integrity Telemetry | Consent-based window blur/tab switch detection; human review queue | `/teacher/integrity`, `TakeQuizPage.tsx` |
| **FR-12: Analytics & Summary** | Reporting Module | Class average, attendance trend charts, AI End-of-Class summary | `/analytics`, `/teacher/summary` |

---

## 3. Technology Stack & Architecture

```
Teacher / Student (Browser)
       │
       ▼
React 19 + TypeScript (Vite Bundler + Tailwind CSS v4)
       │
       ├──────────────► Service Abstraction Layer (apiService.ts)
       │                       │
       │                       ├─► LocalStorage Persistence (Out-of-the-box demo)
       │                       └─► REST API Adapter (Ready for Flask + MySQL)
       │
       ├──────────────► Identity / Device Verification Service Adapter
       │
       └──────────────► AI Abstraction Service (aiService.ts)
                               │
                               ├─► Google Gemini API (When key configured in .env)
                               └─► Deterministic Fallback Engine (Safe demo mode)
```

- **Frontend Core:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS v4, Lucide React icons.
- **Data Visualization:** Recharts (responsive line graphs, bar charts, pie charts).
- **Client Routing:** React Router DOM (v7) with role-based routing and live session banners.
- **Backend Contract:** Clean service abstraction layer pre-configured to plug directly into the Python Flask and MySQL relational backend specified in the project report.

---

## 4. Pre-configured Demo Accounts

For zero-friction demonstration and college evaluations, both roles are pre-seeded with rich sample records:

| Role | Name | Email | Password | Pre-loaded Context |
| :--- | :--- | :--- | :--- | :--- |
| **Instructor** | Dr. Aarav Sharma | `teacher@digitalclassroom.edu` | `Password123!` | 3 Classrooms (CS-301 LIVE, DBMS-304, ML-402), 42 students, 1 submission to grade |
| **Student** | Rohan Verma | `student@digitalclassroom.edu` | `Password123!` | Roll No: `CS23B1042`, Enrolled in SE-2026, 100% verified attendance, 2 digital notes |

> **Convenience Feature:** Use the top-navigation **"Role: Teacher / Student"** toggle button to switch between viewpoints instantly with a single click!

---

## 5. Core End-to-End Workflows

### Workflow 1: Teacher Creates a Class
1. Sign in as Teacher $\rightarrow$ Navigate to **Classrooms & Live Hub** (`/teacher/classrooms`).
2. Click **"+ Create New Classroom"** $\rightarrow$ Fill title, subject, section $\rightarrow$ Submit.
3. System automatically generates a unique join code (e.g., `SE-2026`).
4. New classroom immediately appears on the instructor dashboard.

### Workflow 2: Student Joins via Code & Device Verification
1. Sign in as Student $\rightarrow$ Go to **Join Classroom** (`/student/join`).
2. Enter course code `SE-2026` $\rightarrow$ Click **"Verify & Join"**.
3. The system dispatches an authentication handshake to the **Identity / Device Verification Service**.
4. The hardware fingerprint, browser environment, and biometric status are verified.
5. Attendance is recorded with a single-day idempotent guarantee.
6. A verified access certificate is displayed, and the course is enrolled.

### Workflow 3: Sequential Content Delivery
1. Teacher uploads a resource in **Study Materials** (`/teacher/materials`) with a sequence step number.
2. Clicking **"Publish"** broadcasts the material to enrolled students.
3. In **Student Classroom Stream** (`/student/classrooms/:id`), Step 2 remains locked until the student reads and marks Step 1 as completed.

### Workflow 4: Timed Quiz with Anti-Cheating Telemetry
1. Student starts a quiz from **Quizzes & Tests** (`/student/quizzes`).
2. A live countdown timer starts (e.g., `10:00`).
3. If the student switches browser tabs, the client-side blur listener logs an **Academic Integrity Telemetry Alert** (FR-11).
4. Upon submission, the engine evaluates answers, computes scores, and displays rationale explanations.
5. Teacher inspects the integrity flag under **Academic Integrity Review** (`/teacher/integrity`) to clear false positives or flag for department inquiry.

### Workflow 5: Homework Submission & Rubric Evaluation
1. Student submits solution and document name under **Homework** (`/student/homework`).
2. Teacher receives the pending deliverable alert on the Instructor Dashboard.
3. Teacher opens the **Grading Modal**, inspects the submission, inputs marks, and adds qualitative remarks.
4. The evaluated mark and feedback immediately update on the student's progress report.

### Workflow 6: Live Polls & Digital Doubts
1. Teacher broadcasts an instant MCQ poll during a live lecture (`/teacher/polls`).
2. Student casts vote $\rightarrow$ dynamic progress bars and percentage tallies update in real time.
3. Student clicks **"Raise Digital Hand"** or sends a doubt $\rightarrow$ appears in the instructor's live queue for prompt reply.

---

## 6. AI Learning Assistant Suite (7 Modules)

Accessible via `/ai/workspace`, this suite operates in **dual-mode**:
- **Live Mode:** Connects to Google Gemini API when `VITE_GEMINI_API_KEY` is present.
- **Safe Demo Mode:** Provides high-grade, context-rich deterministic responses without requiring an API key.

1. **AI Study Assistant (Chat):** Conversational AI tutor answering software engineering, database, and algorithm queries with markdown and code blocks.
2. **AI Notes Summarizer:** Condenses dense lecture notes into executive summaries, bullet points, core definitions, and revision checklists.
3. **AI Quiz Generator:** Generates MCQs by topic and difficulty, with a 1-click **"Publish as Live Quiz"** button for teachers.
4. **AI Interactive Flashcards:** Turns study notes into flashcard decks with flip/reveal, shuffle, and revision modes.
5. **AI Doubt Explainer:** Deconstructs complex questions using beginner analogies, step-by-step algorithms, and code examples.
6. **AI Personalized Recommendations:** Analyzes student quiz mistake patterns to prescribe targeted revision tasks.
7. **AI End-of-Class Summary:** Synthesizes verified attendance %, quiz comprehension, unanswered questions, and weak topics into an exportable `.txt` pedagogical summary.

---

## 7. Academic Integrity & Consent-Based Monitoring

In accordance with ethical requirements and Section 11 of the SRS:
- Browser blur and tab-switching events are recorded as **telemetry signals for teacher review**, never as automated verdicts of cheating.
- Accidental window focus losses (OS notifications, system popups) can be cleared with 1 click by the instructor.
- Question orders are randomized per student to reduce peer answer sharing.
- Monitoring is transparent, consent-based, and non-invasive.

---

## 8. Automated Test Suite (Vitest)

The project includes 18 automated unit and integration tests across 4 test suites:
- `tests/classroom.test.ts`: Join code validation, device verification, attendance idempotency, classroom creation.
- `tests/assessments.test.ts`: Automated quiz evaluation, homework rubric grading, doubt workflow.
- `tests/auth.test.ts`: Teacher and student profile separation, login, and logout.
- `tests/aiService.test.ts`: All 7 AI capabilities verified for schema accuracy and demo engine fallback.

To execute tests:
```bash
npm test
```

---

## 9. Installation & Local Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; developed on Node v24).
- npm (v9 or higher).

### Step-by-Step Setup
1. Clone or navigate to the project directory:
   ```bash
   cd digital-classroom-management-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables:
   ```bash
   copy .env.example .env.local
   ```
   Add your Gemini API key to `VITE_GEMINI_API_KEY` if live LLM generation is desired. Otherwise, leave empty for safe demo mode.
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 10. GitHub Repository Setup Commands

To publish this project to your GitHub account:

```bash
# 1. Initialize local git repository
git init

# 2. Add all files (excluding secrets via .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete Digital Classroom Management System (DCMS) with AI Suite"

# 4. Set default branch to main
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/digital-classroom-management-system.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 11. Public Deployment Instructions (Vercel & Netlify)

### Option A: Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import `digital-classroom-management-system`.
4. Build Settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   - Add `VITE_GEMINI_API_KEY` (optional).
6. Click **Deploy**. SPA routing rewrites are pre-configured in `vercel.json`.

### Option B: Deploy to Netlify
1. Sign in to [Netlify](https://www.netlify.com/) and select **"Add new site"** $\rightarrow$ **"Import from Git"**.
2. Select your repository.
3. Build Command: `npm run build`, Publish Directory: `dist`.
4. Click **Deploy Site**. SPA redirects are pre-configured in `public/_redirects`.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
