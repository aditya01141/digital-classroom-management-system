import { describe, it, expect } from 'vitest';
import { aiService } from '../src/services/aiService';

describe('DCMS AI Service Abstraction Layer', () => {
  it('Should provide transparent demo mode indicator and provider name', () => {
    expect(aiService.providerName).toBeDefined();
    // In test environment without key, it must report deterministic demo mode
    expect(aiService.isConfigured).toBe(false);
  });

  it('A. AI Study Assistant should return structured markdown answers', async () => {
    const res = await aiService.askStudyAssistant('What is a sequence diagram?');
    expect(res.data).toContain('Sequence Diagram');
    expect(res.isDemoMode).toBe(true);
    expect(res.provider).toBe('DCMS Deterministic Demo Engine');
  });

  it('B. AI Notes Summarizer should return summary and key concepts', async () => {
    const res = await aiService.summarizeNotes('Sample lecture notes on architecture.');
    expect(res.data.summary).toBeDefined();
    expect(res.data.keyPoints.length).toBeGreaterThan(0);
    expect(res.data.definitions.length).toBeGreaterThan(0);
  });

  it('C. AI Quiz Generator should produce valid MCQ questions with correct answers', async () => {
    const res = await aiService.generateQuiz('Software Architecture', 'Intermediate', 3);
    expect(res.data.length).toBe(3);
    expect(res.data[0].options.length).toBe(4);
    expect(res.data[0].options).toContain(res.data[0].correctAnswer);
  });

  it('D. AI Flashcards Generator should generate question-answer flashcard decks', async () => {
    const res = await aiService.generateFlashcards('Deployment diagrams and hardware topology');
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].question).toBeDefined();
    expect(res.data[0].answer).toBeDefined();
  });

  it('E. AI Doubt Explainer should provide step-by-step guidance and simple analogy', async () => {
    const res = await aiService.explainDoubt('Why verify devices in online classrooms?');
    expect(res.data.stepByStep.length).toBeGreaterThan(0);
    expect(res.data.simpleAnalogy).toBeDefined();
  });

  it('F. AI Recommendations should return prioritized action items', async () => {
    const res = await aiService.getPersonalizedRecommendations('Rohan Verma', ['UML Aggregation']);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].priority).toBeDefined();
    expect(res.data[0].suggestedAction).toBeDefined();
  });

  it('G. AI End-of-Class Summary should synthesize attendance and lecture coverage', async () => {
    const res = await aiService.generateEndOfClassSummary({
      className: 'Advanced Software Engineering',
      topic: 'UML Modeling',
      attendancePresent: 7,
      attendanceTotal: 8,
      quizAvg: 18,
      openDoubts: 1,
    });
    expect(res.data.executiveSummary).toContain('Advanced Software Engineering');
    expect(res.data.weakAreas.length).toBeGreaterThan(0);
  });
});
