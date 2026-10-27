import { describe, it, expect, beforeEach } from 'vitest';
import { apiService } from '../src/services/apiService';

describe('DCMS Assessments, Quizzes & Grading Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
    apiService.resetToDemoDefaults();
  });

  it('TC-10: Should evaluate quiz answers and calculate correct score', () => {
    const quizzes = apiService.getQuizzes();
    const quiz = quizzes[0]; // Mid-module assessment
    expect(quiz).toBeDefined();

    // q1 is 'Sequence Diagram' (5 marks), q2 is 'Aggregation' (5 marks)
    const answers = {
      q1: 'Sequence Diagram',
      q2: 'Aggregation',
      q3: 'Database / UI Frameworks',
      q4: 'Reduces answer sharing and academic dishonesty',
    };

    let calculatedMarks = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id as keyof typeof answers] === q.correctAnswer) {
        calculatedMarks += q.marks;
      }
    });

    expect(calculatedMarks).toBe(20);

    const sub = apiService.submitWork({
      targetId: quiz.id,
      targetType: 'quiz',
      targetTitle: quiz.title,
      classroomId: quiz.classroomId,
      studentId: 'usr_student_01',
      studentName: 'Rohan Verma',
      answers,
      marksObtained: calculatedMarks,
      maxMarks: quiz.maxMarks,
      status: 'graded',
    });

    expect(sub.marksObtained).toBe(20);
    expect(sub.status).toBe('graded');
  });

  it('TC-11: Should allow teacher to grade homework deliverable and add feedback', () => {
    const sub = apiService.submitWork({
      targetId: 'hw_01',
      targetType: 'homework',
      targetTitle: 'Assignment 1',
      classroomId: 'cls_se_301',
      studentId: 'usr_student_03',
      studentName: 'Devansh Jain',
      content: 'Uploaded UML diagrams',
      fileName: 'Devansh_UML.zip',
      maxMarks: 50,
      status: 'submitted',
    });

    const evaluated = apiService.gradeSubmission(sub.id, 47, 'Excellent swimlanes and notations.');
    expect(evaluated?.marksObtained).toBe(47);
    expect(evaluated?.status).toBe('graded');
    expect(evaluated?.feedback).toContain('Excellent swimlanes');
  });

  it('Should handle doubt creation and teacher answering', () => {
    const newDoubt = apiService.raiseDoubt({
      classroomId: 'cls_se_301',
      studentId: 'usr_student_01',
      studentName: 'Rohan Verma',
      message: 'Can you explain the alt fragment condition?',
      isHandRaised: true,
    });

    expect(newDoubt.status).toBe('unanswered');
    expect(newDoubt.isHandRaised).toBe(true);

    const answered = apiService.answerDoubt(
      newDoubt.id,
      'The alt fragment evaluates the Boolean guard condition shown in brackets.',
      'Dr. Aarav Sharma'
    );

    expect(answered?.status).toBe('answered');
    expect(answered?.response).toContain('Boolean guard');
    expect(answered?.isHandRaised).toBe(false);
  });
});
