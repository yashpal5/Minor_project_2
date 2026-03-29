// User Types
export type UserRole = 'student' | 'faculty';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  department?: string;
  rollNumber?: string; // For students
  employeeId?: string; // For faculty
  createdAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity?: number;
  createdBy: string; // Faculty ID
  createdByName: string;
  department: string;
  createdAt: string;
  isAttendanceLocked: boolean;
}

// Registration Types
export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNumber: string;
  registeredAt: string;
}

// Attendance Types
export type AttendanceStatus = 'present' | 'absent' | 'not_marked';

export interface Attendance {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  status: AttendanceStatus;
  markedAt: string;
  markedBy: string;
}

// Email Log Types
export interface EmailLog {
  id: string;
  eventId: string;
  eventTitle: string;
  sentTo: string;
  sentAt: string;
  status: 'sent' | 'failed';
  reportType: 'attendance';
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Dashboard Stats
export interface FacultyStats {
  totalEvents: number;
  totalRegistrations: number;
  totalAttendanceMarked: number;
  upcomingEvents: number;
}

export interface StudentStats {
  registeredEvents: number;
  attendedEvents: number;
  upcomingRegisteredEvents: number;
}