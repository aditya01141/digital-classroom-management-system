import { describe, it, expect, beforeEach } from 'vitest';
import { apiService } from '../src/services/apiService';
import { INITIAL_TEACHER, INITIAL_STUDENT } from '../src/data/mockData';

describe('DCMS Authentication & Role-Based Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('TC-01: Should login and retrieve authenticated teacher profile', () => {
    apiService.setCurrentUser(INITIAL_TEACHER);
    const user = apiService.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.role).toBe('teacher');
    expect(user?.name).toBe('Dr. Aarav Sharma');
    expect(user?.email).toBe('teacher@digitalclassroom.edu');
  });

  it('TC-02: Should handle student authentication and separation', () => {
    apiService.setCurrentUser(INITIAL_STUDENT);
    const user = apiService.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.role).toBe('student');
    expect(user?.rollNumber).toBe('CS23B1042');
  });

  it('Should handle logout cleanly', () => {
    apiService.setCurrentUser(INITIAL_TEACHER);
    expect(apiService.getCurrentUser()).not.toBeNull();
    apiService.setCurrentUser(null);
    expect(apiService.getCurrentUser()).toBeNull();
  });
});
