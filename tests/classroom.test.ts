import { describe, it, expect, beforeEach } from 'vitest';
import { apiService } from '../src/services/apiService';
import { verificationService } from '../src/services/verificationService';

describe('DCMS Core Classroom & Attendance Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
    apiService.resetToDemoDefaults();
  });

  it('TC-04: Should validate join code and add student to enrolled list', () => {
    const res = apiService.joinClassroom('SE-2026', 'test_student_99');
    expect(res.success).toBe(true);
    expect(res.classroom?.title).toContain('Software Engineering');

    const classrooms = apiService.getClassrooms();
    const joined = classrooms.find((c) => c.code === 'SE-2026');
    expect(joined?.enrolledStudents).toContain('test_student_99');
  });

  it('TC-03: Should reject invalid classroom join code', () => {
    const res = apiService.joinClassroom('INVALID-CODE-999', 'test_student_99');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Invalid classroom code');
  });

  it('TC-05 & TC-06: Should verify device and record attendance idempotently', async () => {
    const verification = await verificationService.verifyStudentDevice('usr_student_01', 'CS23B1042');
    expect(verification.isValid).toBe(true);
    expect(verification.deviceId).toContain('DEV-');

    const today = '2026-10-27';
    // Record first time
    const rec1 = apiService.recordAttendance({
      classroomId: 'cls_se_301',
      studentId: 'usr_student_01',
      studentName: 'Rohan Verma',
      rollNumber: 'CS23B1042',
      date: today,
      status: 'present',
      verified: true,
      verificationMethod: 'Device Fingerprint',
      deviceFingerprint: verification.deviceId,
    });

    // Record second time on same day (simulating page reload or duplicate join)
    const rec2 = apiService.recordAttendance({
      classroomId: 'cls_se_301',
      studentId: 'usr_student_01',
      studentName: 'Rohan Verma',
      rollNumber: 'CS23B1042',
      date: today,
      status: 'present',
      verified: true,
      verificationMethod: 'Device Fingerprint',
      deviceFingerprint: verification.deviceId,
    });

    expect(rec1.id).toBe(rec2.id); // Idempotent check
  });

  it('TC-07: Should allow teacher to create classroom and add study materials', () => {
    const newClass = apiService.createClassroom({
      title: 'Cloud Architecture & DevOps',
      subject: 'Cloud Computing',
      description: 'Microservices and Kubernetes',
      section: 'CS-4B',
      code: 'CLOUD-101',
      teacherId: 'usr_teacher_01',
      teacherName: 'Dr. Aarav Sharma',
      scheduledTime: 'Fri 2:00 PM',
      activeSession: true,
      currentTopic: 'Kubernetes Pod Networking',
    });

    expect(newClass.id).toBeDefined();
    expect(newClass.code).toBe('CLOUD-101');

    const newMaterial = apiService.addMaterial({
      classroomId: newClass.id,
      title: 'Kubernetes Cluster Setup Guide',
      description: 'Hands on cluster creation',
      type: 'NOTE',
      contentBody: 'Instructions for minikube',
      isPublished: true,
      sequenceOrder: 1,
    });

    expect(newMaterial.id).toBeDefined();
    const stored = apiService.getMaterials();
    expect(stored.some((m) => m.id === newMaterial.id)).toBe(true);
  });
});
