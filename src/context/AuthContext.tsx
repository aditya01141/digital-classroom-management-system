import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { INITIAL_TEACHER, INITIAL_STUDENT } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  register: (name: string, email: string, role: UserRole, details?: Record<string, string>) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return apiService.getCurrentUser() || INITIAL_TEACHER;
  });

  useEffect(() => {
    if (user) {
      apiService.setCurrentUser(user);
    }
  }, [user]);

  const login = (email: string, role: UserRole, name?: string) => {
    if (role === 'teacher') {
      const teacherUser: User = {
        ...INITIAL_TEACHER,
        email: email || INITIAL_TEACHER.email,
        name: name || INITIAL_TEACHER.name,
      };
      setUser(teacherUser);
    } else {
      const studentUser: User = {
        ...INITIAL_STUDENT,
        email: email || INITIAL_STUDENT.email,
        name: name || INITIAL_STUDENT.name,
      };
      setUser(studentUser);
    }
  };

  const register = (name: string, email: string, role: UserRole, details?: Record<string, string>) => {
    const newUser: User = {
      id: `usr_${role}_${Date.now().toString(36)}`,
      name,
      email,
      role,
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
      avatar:
        role === 'teacher'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      ...(role === 'teacher'
        ? {
            department: details?.department || 'Computer Science & Engineering',
            designation: details?.designation || 'Lecturer & Course Instructor',
          }
        : {
            rollNumber: details?.rollNumber || `CS23B${Math.floor(1000 + Math.random() * 9000)}`,
            program: details?.program || 'B.Tech Computer Science',
            section: details?.section || '3A',
          }),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    apiService.setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'teacher') {
      setUser(INITIAL_TEACHER);
    } else {
      setUser(INITIAL_STUDENT);
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'student',
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
