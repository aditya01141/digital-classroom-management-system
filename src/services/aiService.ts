export interface AIResponse<T = string> {
  data: T;
  isDemoMode: boolean;
  provider: string;
  latencyMs: number;
  timestamp: string;
}

export interface GeneratedQuizItem {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GeneratedFlashcard {
  question: string;
  answer: string;
  category: string;
}

export interface AIRecommendation {
  topic: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  relatedMaterialTitle?: string;
}

class AIService {
  private apiKey: string = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  get providerName(): string {
    return this.isConfigured ? 'Google Gemini AI (Live API)' : 'DCMS Deterministic Demo Engine';
  }

  /**
   * Helper to execute Gemini request or return deterministic response
   */
  private async executePrompt(promptText: string, fallbackGenerator: () => string): Promise<{ text: string; isDemo: boolean; latency: number }> {
    const startTime = Date.now();

    if (this.isConfigured) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const json = await response.json();
        const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            text: candidateText,
            isDemo: false,
            latency: Date.now() - startTime,
          };
        }
      } catch (err) {
        console.warn('Real AI request failed, falling back to deterministic demo engine:', err);
      }
    }

    // Deterministic fallback with realistic processing delay
    await new Promise((res) => setTimeout(res, 500));
    return {
      text: fallbackGenerator(),
      isDemo: true,
      latency: Date.now() - startTime,
    };
  }

  /**
   * A. AI Study Assistant (Chat)
   */
  async askStudyAssistant(question: string, context?: string): Promise<AIResponse<string>> {
    const fallback = () => {
      const q = question.toLowerCase();
      if (q.includes('sequence diagram') || q.includes('uml')) {
        return `### Sequence Diagrams in Software Engineering\n\nA **Sequence Diagram** is an interaction diagram that shows how processes operate with one another and in what order.\n\n#### Key Elements:\n1. **Lifelines**: Vertical dashed lines indicating the presence of an object over time.\n2. **Synchronous Messages**: Solid line with a filled arrowhead ($\rightarrow$).\n3. **Return Messages**: Dashed line with open arrowhead ($-->$).\n4. **Activation Bars**: Thin vertical boxes showing when an instance is executing an operation.\n\n\`\`\`mermaid\nsequenceDiagram\n    autonumber\n    Student->>DCMS: Join Session(Class Code)\n    DCMS->>VerificationService: Verify Device()\n    VerificationService-->>DCMS: Valid Token\n    DCMS-->>Student: Display Classroom Content\n\`\`\`\n\n*Would you like an example of an 'alt' fragment for error handling?*`;
      }
      if (q.includes('acid') || q.includes('database') || q.includes('sql')) {
        return `### ACID Properties in Relational Databases\n\n- **Atomicity**: The entire transaction completes successfully, or all changes are rolled back.\n- **Consistency**: The database transitions from one valid invariant state to another.\n- **Isolation**: Concurrent transactions execute without cross-interference.\n- **Durability**: Committed data survives system failures or power outages.\n\nIn our DCMS project, student submissions use atomic transactions to prevent partial grade recordings!`;
      }
      return `### Learning Explanation for: "${question}"\n\nHere is a structured breakdown of the concept:\n\n1. **Core Definition**: This concept is fundamental to modern software engineering and computational architectures.\n2. **Key Mechanisms**:\n   - Decoupled modules ensure high cohesion and low coupling.\n   - Systematic state management minimizes runtime regressions.\n   - Predictable interfaces allow seamless testing.\n3. **Practical Application**: In enterprise systems, implementing this ensures horizontal scalability and fault tolerance.`;
    };

    const prompt = `You are an expert AI Computer Science and Engineering Tutor. Answer this student's inquiry clearly with formatted markdown, headings, bullet points, and code or diagrams where helpful.\nInquiry: ${question}\nContext: ${context || 'General CS curriculum'}`;

    const res = await this.executePrompt(prompt, fallback);
    return {
      data: res.text,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  /**
   * B. AI Notes Summarizer
   */
  async summarizeNotes(notesText: string): Promise<AIResponse<{ summary: string; keyPoints: string[]; definitions: { term: string; def: string }[]; revisionChecklist: string[] }>> {
    const fallback = () => {
      return JSON.stringify({
        summary: 'The study text emphasizes foundational software modeling standards, the role of structural and behavioral UML diagrams, and anti-cheating mechanisms in digital learning platforms.',
        keyPoints: [
          'Structural diagrams (Class, Component, Deployment) model static topology.',
          'Behavioral diagrams (Sequence, Activity, State) map temporal and event flows.',
          'Identity and Device Verification services mitigate proxy attendance through hardware tokens.',
          'Tab switch and blur detections provide reviewable integrity signals rather than definitive proof of cheating.',
        ],
        definitions: [
          { term: 'Dependency Inversion', def: 'High-level modules should not depend on low-level modules; both should depend on abstractions.' },
          { term: 'Idempotency', def: 'An operation that produces the exact same outcome even if invoked repeatedly.' },
        ],
        revisionChecklist: [
          'Review the difference between hollow diamond (Aggregation) and solid diamond (Composition).',
          'Practice drawing an alt fragment in a sequence diagram.',
          'Memorize the 4 ACID properties for relational schemas.',
        ],
      });
    };

    const prompt = `Analyze the provided notes and return a valid JSON object with the following fields: 'summary' (string), 'keyPoints' (array of strings), 'definitions' (array of {term, def}), 'revisionChecklist' (array of strings).\nNotes:\n${notesText}`;

    const res = await this.executePrompt(prompt, fallback);
    let parsed;
    try {
      parsed = JSON.parse(res.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      parsed = JSON.parse(fallback());
    }

    return {
      data: parsed,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  /**
   * C. AI Quiz Generator
   */
  async generateQuiz(topic: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', questionCount: number = 4): Promise<AIResponse<GeneratedQuizItem[]>> {
    const fallback = (): string => {
      const items: GeneratedQuizItem[] = [
        {
          questionText: `What is the primary role of an Activity Diagram in ${topic}?`,
          options: ['Modeling physical server nodes', 'Visualizing workflow and step-by-step logic across swimlanes', 'Storing database schema relations', 'Compiling source code'],
          correctAnswer: 'Visualizing workflow and step-by-step logic across swimlanes',
          explanation: 'Activity diagrams depict business flows, branching decisions, and concurrent tasks among actors.',
        },
        {
          questionText: `Which principle states that a software component should have only one reason to change?`,
          options: ['Single Responsibility Principle (SRP)', 'Open-Closed Principle (OCP)', 'Liskov Substitution Principle (LSP)', 'Interface Segregation Principle (ISP)'],
          correctAnswer: 'Single Responsibility Principle (SRP)',
          explanation: 'SRP forms the S in SOLID design principles.',
        },
        {
          questionText: `How does question randomization help assessment integrity?`,
          options: ['Shortens the exam time', 'Alters sequence to mitigate direct peer copying', 'Increases server storage', 'Changes the passing grade'],
          correctAnswer: 'Alters sequence to mitigate direct peer copying',
          explanation: 'Randomized sequences ensure neighboring students do not see questions in matching orders.',
        },
        {
          questionText: `In a 3-tier architecture, what is situated between the Presentation Layer and Database Layer?`,
          options: ['Business Logic / Application Layer', 'Hardware Firmware', 'Operating System Kernel', 'Client Web Browser'],
          correctAnswer: 'Business Logic / Application Layer',
          explanation: 'The Business Logic / Application Module coordinates business rules and data transformation.',
        },
      ];
      return JSON.stringify(items.slice(0, questionCount));
    };

    const prompt = `Generate ${questionCount} multiple-choice quiz questions on the topic "${topic}" at ${difficulty} level. Return ONLY valid JSON array of objects with keys: "questionText", "options" (array of 4 strings), "correctAnswer" (must match one option), "explanation" (string).`;

    const res = await this.executePrompt(prompt, fallback);
    let questions: GeneratedQuizItem[];
    try {
      questions = JSON.parse(res.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      questions = JSON.parse(fallback());
    }

    return {
      data: questions,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  /**
   * D. AI Flashcard Generator
   */
  async generateFlashcards(materialText: string): Promise<AIResponse<GeneratedFlashcard[]>> {
    const fallback = (): string => {
      const cards: GeneratedFlashcard[] = [
        {
          category: 'UML & Modeling',
          question: 'What is the purpose of a Deployment Diagram?',
          answer: 'It visualizes physical hardware topology, computing nodes (servers, devices), and software artifact distributions.',
        },
        {
          category: 'Software Architecture',
          question: 'What does Separation of Concerns (SoC) prevent?',
          answer: 'It prevents tight coupling by isolating responsibilities into distinct modules (e.g. UI vs Data Access vs Business Logic).',
        },
        {
          category: 'Assessment Integrity',
          question: 'Why should blur events not trigger automatic student disqualification?',
          answer: 'OS updates, accidental cursor slips, or accessibility tools can trigger blur events; human review is required to prevent false positives.',
        },
        {
          category: 'Database Systems',
          question: 'What distinguishes BCNF from 3NF?',
          answer: 'BCNF requires every non-trivial functional dependency determinant (X in X -> Y) to be a superkey, whereas 3NF permits Y to be a prime attribute.',
        },
      ];
      return JSON.stringify(cards);
    };

    const prompt = `Create 4 high-yield flashcards from this text. Return ONLY a valid JSON array of objects with "question", "answer", and "category".\nText: ${materialText}`;

    const res = await this.executePrompt(prompt, fallback);
    let cards: GeneratedFlashcard[];
    try {
      cards = JSON.parse(res.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      cards = JSON.parse(fallback());
    }

    return {
      data: cards,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  /**
   * E. AI Doubt Explainer
   */
  async explainDoubt(doubtText: string, level: 'Beginner' | 'Deep Dive' = 'Beginner'): Promise<AIResponse<{ stepByStep: string[]; simpleAnalogy: string; codeOrFormulaExample: string }>> {
    const fallback = () => {
      return JSON.stringify({
        stepByStep: [
          'Identify the underlying domain entity and actor boundaries.',
          'Trace the lifecycle from input trigger through business validation to persisted state.',
          'Isolate the decision junction (e.g., valid vs invalid verification).',
          'Observe the confirmation feedback dispatched back to the caller.',
        ],
        simpleAnalogy: 'Think of device verification like an airport boarding gate: before you board (join class), your passport and ticket (device fingerprint and session code) are checked. Only valid boarding passes enter the plane!',
        codeOrFormulaExample: `// Verification Token Validation Logic\nfunction verifyJoin(studentId, classCode, deviceFingerprint) {\n  const isValid = tokenStore.verify(studentId, deviceFingerprint);\n  if (!isValid) throw new Error("Verification Failure: Unauthorized hardware");\n  return attendanceLogger.record({ studentId, classCode, status: "PRESENT" });\n}`,
      });
    };

    const prompt = `Explain the following student question/doubt at a ${level} level. Return ONLY a valid JSON object with keys: "stepByStep" (array of strings), "simpleAnalogy" (string), "codeOrFormulaExample" (string).\nDoubt: ${doubtText}`;

    const res = await this.executePrompt(prompt, fallback);
    let output;
    try {
      output = JSON.parse(res.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      output = JSON.parse(fallback());
    }

    return {
      data: output,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  /**
   * F. AI Personalized Learning Recommendations
   */
  async getPersonalizedRecommendations(studentName: string, weakTopics: string[]): Promise<AIResponse<AIRecommendation[]>> {
    const fallback = (): string => {
      return JSON.stringify([
        {
          topic: 'UML Aggregation vs Composition Notations',
          priority: 'High',
          reason: 'Missed in Quiz 1 Question 2; confusion identified between lifecycle-dependent composition and loose aggregation.',
          suggestedAction: 'Review Lecture 04 Study Notes, section 1.1 on diamond relationships.',
          relatedMaterialTitle: 'Lecture 04: UML Structural vs Behavioral Modeling Notes',
        },
        {
          topic: 'Database Concurrency & 2-Phase Locking',
          priority: 'Medium',
          reason: 'Identified as a class-wide review topic in recent lecture summary.',
          suggestedAction: 'Attempt the ACID practice quiz and review slide deck #3.',
          relatedMaterialTitle: 'SQL Normalization Guide (1NF to BCNF)',
        },
        {
          topic: 'Activity Diagram Swimlane Organization',
          priority: 'Low',
          reason: 'Solid performance on Assignment 1, but minor layout feedback provided on actor partitions.',
          suggestedAction: 'Reference the standard OMG UML 2.5 sample partition guide.',
        },
      ]);
    };

    const prompt = `Given student "${studentName}" with weak topics: ${weakTopics.join(', ')}. Generate tailored learning recommendations. Return ONLY JSON array of {topic, priority, reason, suggestedAction, relatedMaterialTitle}.`;

    const res = await this.executePrompt(prompt, fallback);
    let recommendations: AIRecommendation[];
    try {
      recommendations = JSON.parse(res.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      recommendations = JSON.parse(fallback());
    }

    return {
      data: recommendations,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  /**
   * G. AI End-of-Class Summary
   */
  async generateEndOfClassSummary(classData: {
    className: string;
    topic: string;
    attendancePresent: number;
    attendanceTotal: number;
    quizAvg: number;
    openDoubts: number;
  }): Promise<AIResponse<{ executiveSummary: string; keyHighlights: string[]; weakAreas: string[]; actionableNextSteps: string[] }>> {
    const fallback = () => {
      return JSON.stringify({
        executiveSummary: `Today's session for "${classData.className}" on "${classData.topic}" concluded with high attendance (${Math.round((classData.attendancePresent / classData.attendanceTotal) * 100)}%) and an average quiz performance of ${classData.quizAvg}/20 marks.`,
        keyHighlights: [
          `Verified attendance reached ${classData.attendancePresent} of ${classData.attendanceTotal} students via biometric/fingerprint handshake.`,
          'Interactive architectural polling observed 90%+ real-time class participation.',
          'Sequential learning milestone achieved for UML modeling materials.',
        ],
        weakAreas: [
          'Differentiating strong aggregation from weak aggregation in class diagrams.',
          'Handling exception rollback in distributed sequence fragments.',
        ],
        actionableNextSteps: [
          `Address the ${classData.openDoubts} unresolved student questions in the doubt queue before next session.`,
          'Post supplementary flashcards for SOLID architectural principles.',
          'Open Homework Assignment 2 submission portal on schedule.',
        ],
      });
    };

    const prompt = `Synthesize an End-of-Class Summary for a teacher based on this lecture record: Class: ${classData.className}, Topic: ${classData.topic}, Present: ${classData.attendancePresent}/${classData.attendanceTotal}, Quiz Average: ${classData.quizAvg}, Open Doubts: ${classData.openDoubts}. Return ONLY JSON with keys: executiveSummary, keyHighlights, weakAreas, actionableNextSteps.`;

    const res = await this.executePrompt(prompt, fallback);
    let summaryObj;
    try {
      summaryObj = JSON.parse(res.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      summaryObj = JSON.parse(fallback());
    }

    return {
      data: summaryObj,
      isDemoMode: res.isDemo,
      provider: res.isDemo ? 'DCMS Deterministic Demo Engine' : 'Google Gemini API',
      latencyMs: res.latency,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}

export const aiService = new AIService();
