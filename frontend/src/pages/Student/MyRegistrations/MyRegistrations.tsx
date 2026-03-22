import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
} from "lucide-react";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import "./MyRegistrations.css";

const API_BASE = "http://localhost:3000/api";

export const MyRegistrations: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      // Fetch my registrations
      const regRes = await fetch(
        `${API_BASE}/registrations/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const regData = await regRes.json();
      setRegistrations(regData);

      // Fetch my attendance
      const attRes = await fetch(
        `${API_BASE}/attendance/my/records`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const attData = await attRes.json();
      setAttendance(attData);

      // Fetch events for mapping
      const eventRes = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventData = await eventRes.json();

      const map: Record<string, any> = {};
      eventData.forEach((e: any) => {
        map[e._id] = e;
      });
      setEventsMap(map);
    };

    fetchData();
  }, [user]);

  const groupedRegistrations = useMemo(() => {
    if (!user) return { upcoming: [], past: [] };

    const now = new Date();

    const enriched = registrations
      .map((reg) => {
        const event = eventsMap[reg.eventId];
        const attendanceRecord = attendance.find(
          (a) => a.eventId === reg.eventId
        );
        return event
          ? {
              ...reg,
              event,
              attendanceStatus:
                attendanceRecord?.status || "not_marked",
            }
          : null;
      })
      .filter(Boolean) as any[];

    const upcoming = enriched
      .filter((r) =>
        isAfter(parseISO(r.event.date), now)
      )
      .sort(
        (a, b) =>
          parseISO(a.event.date).getTime() -
          parseISO(b.event.date).getTime()
      );

    const past = enriched
      .filter((r) =>
        isBefore(parseISO(r.event.date), now)
      )
      .sort(
        (a, b) =>
          parseISO(b.event.date).getTime() -
          parseISO(a.event.date).getTime()
      );

    return { upcoming, past };
  }, [registrations, attendance, eventsMap, user]);

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "present":
        return (
          <CheckCircle2
            size={18}
            className="status-icon present"
          />
        );
      case "absent":
        return (
          <XCircle
            size={18}
            className="status-icon absent"
          />
        );
      default:
        return (
          <Clock3
            size={18}
            className="status-icon pending"
          />
        );
    }
  };

  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      default:
        return "Pending";
    }
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <div className="registrations-header">
        <h1>My Registrations</h1>
        <p className="text-secondary">
          Track your event registrations and attendance
        </p>
      </div>

      {/* UPCOMING */}
      <div className="registrations-section">
        <h2>
          <Calendar size={22} />
          Upcoming Events (
          {groupedRegistrations.upcoming.length})
        </h2>

        {groupedRegistrations.upcoming.length > 0 ? (
          <div className="registrations-list">
            {groupedRegistrations.upcoming.map(
              (reg) => (
                <Link
                  key={reg._id}
                  to={`/student/events/${reg.eventId}`}
                  className="registration-card card"
                >
                  <div className="reg-date-badge">
                    <span className="date-day">
                      {format(
                        parseISO(reg.event.date),
                        "d"
                      )}
                    </span>
                    <span className="date-month">
                      {format(
                        parseISO(reg.event.date),
                        "MMM"
                      )}
                    </span>
                  </div>

                  <div className="reg-content">
                    <div className="reg-header">
                      <h3>{reg.event.title}</h3>
                      <span className="badge badge-info">
                        Upcoming
                      </span>
                    </div>

                    <div className="reg-details">
                      <span>
                        <Clock size={14} />{" "}
                        {reg.event.time}
                      </span>
                      <span>
                        <MapPin size={14} />{" "}
                        {reg.event.venue}
                      </span>
                    </div>

                    <div className="reg-meta">
                      <span className="reg-date">
                        Registered on{" "}
                        {format(
                          parseISO(reg.registeredAt),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="empty-state card">
            <CalendarDays size={48} />
            <h3>No upcoming registrations</h3>
            <p>
              Browse events and register to see
              them here
            </p>
            <Link
              to="/student/events"
              className="btn btn-primary"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* PAST */}
      <div className="registrations-section">
        <h2>
          <Clock size={22} />
          Past Events (
          {groupedRegistrations.past.length})
        </h2>

        {groupedRegistrations.past.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {groupedRegistrations.past.map(
                  (reg) => (
                    <tr key={reg._id}>
                      <td>
                        <Link
                          to={`/student/events/${reg.eventId}`}
                          className="event-link"
                        >
                          {reg.event.title}
                        </Link>
                      </td>
                      <td>
                        {format(
                          parseISO(reg.event.date),
                          "MMM d, yyyy"
                        )}
                      </td>
                      <td>{reg.event.venue}</td>
                      <td>
                        <div className="attendance-cell">
                          {getAttendanceIcon(
                            reg.attendanceStatus
                          )}
                          <span
                            className={`attendance-label ${reg.attendanceStatus}`}
                          >
                            {getAttendanceLabel(
                              reg.attendanceStatus
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state card">
            <Clock size={48} />
            <h3>No past events</h3>
            <p>
              Your past event registrations will
              appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
