// src/utils/storage.ts
import type { User, Event, Registration, Attendance, EmailLog } from "../types";

/*
  🚫 STORAGE DISABLED

  This project uses a REAL BACKEND.
  These functions exist ONLY to avoid import crashes.

  ❗ If ANY of these functions are called,
  it means a page is NOT properly wired to the backend.
*/

const disabled = (fn: string): never => {
  throw new Error(`❌ storage.ts function "${fn}" was called. Use backend API instead.`);
};

// ---------------- USERS ----------------
export const getUsers = (): User[] => disabled("getUsers");
export const setUsers = (_u: User[]): void => disabled("setUsers");
export const addUser = (_u: User): void => disabled("addUser");
export const getUserByEmail = (_e: string): User | undefined => disabled("getUserByEmail");
export const getUserById = (_i: string): User | undefined => disabled("getUserById");

// ---------------- CURRENT USER ----------------
export const getCurrentUser = (): User | null => disabled("getCurrentUser");
export const setCurrentUser = (_u: User | null): void => disabled("setCurrentUser");

// ---------------- EVENTS ----------------
export const getEvents = (): Event[] => disabled("getEvents");
export const setEvents = (_e: Event[]): void => disabled("setEvents");
export const addEvent = (_e: Event): void => disabled("addEvent");
export const updateEvent = (_id: string, _data: Partial<Event>): void => disabled("updateEvent");
export const getEventById = (_id: string): Event | undefined => disabled("getEventById");
export const getEventsByFaculty = (_fid: string): Event[] => disabled("getEventsByFaculty");
export const deleteEvent = (_id: string): void => disabled("deleteEvent");

// ---------------- REGISTRATIONS ----------------
export const getRegistrations = (): Registration[] => disabled("getRegistrations");
export const setRegistrations = (_r: Registration[]): void => disabled("setRegistrations");
export const addRegistration = (_r: Registration): void => disabled("addRegistration");
export const getRegistrationsByEvent = (_eid: string): Registration[] =>
  disabled("getRegistrationsByEvent");
export const getRegistrationsByStudent = (_sid: string): Registration[] =>
  disabled("getRegistrationsByStudent");
export const isStudentRegistered = (_eid: string, _sid: string): boolean =>
  disabled("isStudentRegistered");
export const cancelRegistration = (_eid: string, _sid: string): void =>
  disabled("cancelRegistration");

// ---------------- ATTENDANCE ----------------
export const getAttendance = (): Attendance[] => disabled("getAttendance");
export const setAttendance = (_a: Attendance[]): void => disabled("setAttendance");
export const addOrUpdateAttendance = (_a: Attendance): void =>
  disabled("addOrUpdateAttendance");
export const getAttendanceByEvent = (_eid: string): Attendance[] =>
  disabled("getAttendanceByEvent");
export const getAttendanceByStudent = (_sid: string): Attendance[] =>
  disabled("getAttendanceByStudent");
export const bulkUpdateAttendance = (_a: Attendance[]): void =>
  disabled("bulkUpdateAttendance");

// ---------------- EMAIL LOGS ----------------
export const getEmailLogs = (): EmailLog[] => disabled("getEmailLogs");
export const setEmailLogs = (_e: EmailLog[]): void => disabled("setEmailLogs");
export const addEmailLog = (_e: EmailLog): void => disabled("addEmailLog");
export const getEmailLogsByEvent = (_eid: string): EmailLog[] =>
  disabled("getEmailLogsByEvent");

// ---------------- DEMO DATA ----------------
export const initializeDemoData = (): void => {
  // intentionally disabled
};