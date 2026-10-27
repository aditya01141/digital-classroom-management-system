export interface DeviceVerificationResult {
  isValid: boolean;
  deviceId: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  biometricVerified: boolean;
  verificationToken: string;
  timestamp: string;
  message: string;
}

export const verificationService = {
  /**
   * Simulates the external Identity / Device Verification Service as specified in UML
   * Use Case & Sequence Diagrams (messages 8-9: Verify identity/device -> verification result).
   */
  async verifyStudentDevice(studentId: string, rollNumber: string): Promise<DeviceVerificationResult> {
    // Simulate brief network verification handshake with external service
    await new Promise((res) => setTimeout(res, 600));

    const ua = navigator.userAgent;
    let browser = 'Chrome';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Microsoft Edge';

    let os = 'Windows 11 / Desktop';
    if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android Mobile';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    const rawId = `${studentId}-${rollNumber}-${screen.width}x${screen.height}-${navigator.language}`;
    const hash = Array.from(rawId).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0);
    const deviceId = `DEV-${browser.toUpperCase().slice(0, 3)}-${hash.toString(16).toUpperCase()}`;

    return {
      isValid: true,
      deviceId,
      deviceType: screen.width < 768 ? 'Mobile Client' : 'Laptop / Desktop Workstation',
      os,
      browser,
      ipAddress: '192.168.1.104 (Campus Subnet)',
      biometricVerified: true,
      verificationToken: `AUTH_TOKEN_V2_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
      message: 'Hardware fingerprint and biometric validation confirmed by Verification Service.',
    };
  },
};
