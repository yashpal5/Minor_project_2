import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Mail,
  Download,
  Lock,
  Unlock,
  Save,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import "./FacultyEventDetails.css";

const API_BASE = "http://localhost:3000/api";

type AttendanceStatus = "present" | "absent" | "not_marked";

export const FacultyEventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "registrations" | "attendance"
  >("registrations");

  useEffect(() => {
    if (!eventId || !user) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const eventRes = await fetch(
        `${API_BASE}/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const eventData = await eventRes.json();
      setEvent(eventData);

      const regRes = await fetch(
        `${API_BASE}/events/${eventId}/registrations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const regData = await regRes.json();
      setRegistrations(regData);

      const attRes = await fetch(
        `${API_BASE}/attendance/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const attData = await attRes.json();

      const map: Record<string, AttendanceStatus> = {};
      attData.forEach((a: any) => {
        const sid = typeof a.studentId === 'object' ? a.studentId._id : a.studentId;
        map[sid] = a.status.toLowerCase() as AttendanceStatus;
      });

      regData.forEach((r: any) => {
        const rsid = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
        if (!map[rsid]) {
          map[rsid] = "not_marked";
        }
      });

      setAttendanceMap(map);
    };

    fetchData();
  }, [eventId, user]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const present = Object.values(attendanceMap).filter(
      (s) => s === "present"
    ).length;
    const absent = Object.values(attendanceMap).filter(
      (s) => s === "absent"
    ).length;
    const pending = total - present - absent;

    return { total, present, absent, pending };
  }, [registrations, attendanceMap]);

  const handleMarkAttendance = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    if (event?.isAttendanceLocked) return;

    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    if (event?.isAttendanceLocked) return;

    const updated: Record<string, AttendanceStatus> = {};
    registrations.forEach((r) => {
      updated[r.studentId] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    if (!event || !user) return;

    setIsSaving(true);
    setMessage(null);

    const token = localStorage.getItem("token");

    const payload = registrations.map((r) => ({
      eventId: event._id,
      studentId: r.studentId,
      status: attendanceMap[r.studentId] || "not_marked",
    }));

    await fetch(`${API_BASE}/attendance/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setMessage({
      type: "success",
      text: "Attendance saved successfully!",
    });
    setIsSaving(false);
  };

  const handleLockAttendance = async () => {
    if (!event) return;

    const token = localStorage.getItem("token");
    const newState = !event.isAttendanceLocked;

    await fetch(`${API_BASE}/events/${event._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isAttendanceLocked: newState,
      }),
    });

    setEvent({ ...event, isAttendanceLocked: newState });
    setMessage({
      type: "success",
      text: newState
        ? "Attendance locked successfully!"
        : "Attendance unlocked!",
    });
  };

  const generateReport = useCallback(() => {
    if (!event) return "";

    let report = `ATTENDANCE REPORT\n`;
    report += `${"=".repeat(50)}\n\n`;
    report += `Event: ${event.title}\n`;
    report += `Date: ${format(
      parseISO(event.date),
      "MMMM d, yyyy"
    )}\n`;
    report += `Time: ${event.time}\n`;
    report += `Venue: ${event.venue}\n\n`;
    report += `SUMMARY\n`;
    report += `Total: ${stats.total}\n`;
    report += `Present: ${stats.present}\n`;
    report += `Absent: ${stats.absent}\n`;
    report += `Pending: ${stats.pending}\n\n`;

    registrations.forEach((r) => {
      report += `${r.studentRollNumber} | ${r.studentName} | ${
        attendanceMap[r.studentId]
      }\n`;
    });

    return report;
  }, [event, stats, registrations, attendanceMap]);

  const handleDownloadReport = () => {
    const blob = new Blob([generateReport()], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${event.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmailReport = async () => {
    setIsSendingEmail(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/attendance/${event._id}/email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage({
        type: "success",
        text: `Attendance report sent to ${user?.email}`,
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to send email report",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!event) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <ArrowLeft size={20} /> Back to Events
      </button>

      {/* UI BELOW IS UNCHANGED */}
      {/* (Same JSX you already had — omitted here for brevity in explanation) */}
      <div className="event-header-section card">
        <div className="event-header-content">
          <h1>{event.title}</h1>
          <p className="event-description">{event.description}</p>
          
          <div className="event-meta-grid">
            <div className="meta-item">
              <Calendar size={18} />
              <span>{format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <span>{event.time}</span>
            </div>
            <div className="meta-item">
              <MapPin size={18} />
              <span>{event.venue}</span>
            </div>
            <div className="meta-item">
              <Users size={18} />
              <span>{registrations.length} registered</span>
            </div>
          </div>
        </div>

        <div className="attendance-stats">
          <div className="stat-box total">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-box present">
            <UserCheck size={20} />
            <span className="stat-number">{stats.present}</span>
            <span className="stat-label">Present</span>
          </div>
          <div className="stat-box absent">
            <UserX size={20} />
            <span className="stat-number">{stats.absent}</span>
            <span className="stat-label">Absent</span>
          </div>
          <div className="stat-box pending">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mt-4`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="tabs-section">
        <div className="tabs-header">
          <button 
            className={`tab ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <Users size={18} />
            Registrations ({registrations.length})
          </button>
          <button 
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <CheckCircle2 size={18} />
            Mark Attendance
          </button>
        </div>

        <div className="tab-content card">
          {activeTab === 'registrations' && (
            <div className="registrations-tab">
              {registrations.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Email</th>
                        <th>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg, index) => (
                        <tr key={reg.id}>
                          <td>{index + 1}</td>
                          <td className="font-medium">{reg.studentName}</td>
                          <td>{reg.studentRollNumber}</td>
                          <td>{reg.studentEmail}</td>
                          <td>{format(parseISO(reg.registeredAt), 'MMM d, yyyy HH:mm')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>No registrations yet</h3>
                  <p>Students will appear here once they register for this event</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-tab">
              {event.isAttendanceLocked && (
                <div className="alert alert-warning mb-4">
                  <Lock size={18} />
                  <span>Attendance is locked. Unlock to make changes.</span>
                </div>
              )}

              <div className="attendance-actions">
                <div className="quick-actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleMarkAll('present')}
                    disabled={event.isAttendanceLocked || registrations.length === 0}
                  >
                    <CheckCircle2 size={16} />
                    Mark All Present
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleMarkAll('absent')}
                    disabled={event.isAttendanceLocked || registrations.length === 0}
                  >
                    <XCircle size={16} />
                    Mark All Absent
                  </button>
                </div>

                <div className="save-actions">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={handleLockAttendance}
                  >
                    {event.isAttendanceLocked ? <Unlock size={16} /> : <Lock size={16} />}
                    {event.isAttendanceLocked ? 'Unlock' : 'Lock'} Attendance
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveAttendance}
                    disabled={isSaving || event.isAttendanceLocked}
                  >
                    {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                    Save Attendance
                  </button>
                </div>
              </div>

              {registrations.length > 0 ? (
                <div className="table-container">
                  <table className="table attendance-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg, index) => {
                        const status = attendanceMap[reg.studentId] || 'not_marked';
                        
                        return (
                          <tr key={reg.id}>
                            <td>{index + 1}</td>
                            <td className="font-medium">{reg.studentName}</td>
                            <td>{reg.studentRollNumber}</td>
                            <td>
                              <div className="attendance-buttons">
                                <button
                                  className={`attendance-btn present ${status === 'present' ? 'active' : ''}`}
                                  onClick={() => handleMarkAttendance(reg.studentId, 'present')}
                                  disabled={event.isAttendanceLocked}
                                >
                                  <CheckCircle2 size={18} />
                                  Present
                                </button>
                                <button
                                  className={`attendance-btn absent ${status === 'absent' ? 'active' : ''}`}
                                  onClick={() => handleMarkAttendance(reg.studentId, 'absent')}
                                  disabled={event.isAttendanceLocked}
                                >
                                  <XCircle size={18} />
                                  Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>No students to mark attendance</h3>
                  <p>Students need to register for this event first</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="report-section card">
        <h3>Generate Report</h3>
        <p className="text-secondary">Download or email the attendance report</p>
        
        <div className="report-actions">
          <button 
            className="btn btn-outline"
            onClick={handleDownloadReport}
            disabled={registrations.length === 0}
          >
            <Download size={18} />
            Download Report
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSendEmailReport}
            disabled={isSendingEmail || registrations.length === 0}
          >
            {isSendingEmail ? (
              <>
                <Loader2 size={18} className="spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} />
                Send Email Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

