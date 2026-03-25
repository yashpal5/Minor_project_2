import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  Users,
  ClipboardCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import "./FacultyDashboard.css";

const API_BASE = "http://localhost:3000/api";

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      // Fetch all events
      const eventsRes = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allEvents = await eventsRes.json();

      const facultyEvents = allEvents.filter(
        (e: any) => e.createdBy === user.id
      );
      setEvents(facultyEvents);

      // Fetch registrations and attendance
      const registrationPromises = facultyEvents.map((e: any) =>
        fetch(`${API_BASE}/events/${e._id}/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      );

      const attendancePromises = facultyEvents.map((e: any) =>
        fetch(`${API_BASE}/attendance/${e._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      );

      const regResults = (await Promise.all(registrationPromises)).flat();
      const attendanceResults = (await Promise.all(attendancePromises)).flat();

      setRegistrations(regResults);
      setAttendance(attendanceResults);
    };

    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    if (!user) return null;

    const now = new Date();
    const upcomingEvents = events.filter((e) =>
      isAfter(parseISO(e.date), now)
    );

    return {
      totalEvents: events.length,
      totalRegistrations: registrations.length,
      totalAttendanceMarked: attendance.length,
      upcomingEvents: upcomingEvents.length,
    };
  }, [user, events, registrations, attendance]);

  const recentEvents = useMemo(() => {
    return [...events]
      .sort(
        (a, b) =>
          parseISO(b.createdAt).getTime() -
          parseISO(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [events]);

  if (!user || !stats) return null;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name.split(" ")[0]}! 👋</h1>
          <p className="text-secondary">
            Manage your events and track attendance
          </p>
        </div>
        <Link to="/faculty/create-event" className="btn btn-primary">
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(139, 35, 50, 0.1)",
              color: "var(--color-primary)",
            }}
          >
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalEvents}</span>
            <span className="stat-label">Total Events</span>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(21, 101, 192, 0.1)",
              color: "var(--color-info)",
            }}
          >
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.totalRegistrations}
            </span>
            <span className="stat-label">Total Registrations</span>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(46, 125, 50, 0.1)",
              color: "var(--color-success)",
            }}
          >
            <ClipboardCheck size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.totalAttendanceMarked}
            </span>
            <span className="stat-label">Attendance Marked</span>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(245, 124, 0, 0.1)",
              color: "var(--color-warning)",
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.upcomingEvents}</span>
            <span className="stat-label">Upcoming Events</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>
            <Calendar size={22} />
            Your Recent Events
          </h2>
          <Link to="/faculty/events" className="btn btn-ghost btn-sm">
            View All
          </Link>
        </div>

        {recentEvents.length > 0 ? (
          <div className="events-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Registrations</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => {
                  const eventRegistrations = registrations.filter(
                    (r) => r.eventId === event._id
                  );
                  const isPast = !isAfter(
                    parseISO(event.date),
                    new Date()
                  );

                  return (
                    <tr key={event._id}>
                      <td>
                        <div className="event-cell">
                          <span className="event-title">
                            {event.title}
                          </span>
                          <span className="event-dept">
                            {event.department}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-cell">
                          <span>
                            <Calendar size={14} />{" "}
                            {format(
                              parseISO(event.date),
                              "MMM d, yyyy"
                            )}
                          </span>
                          <span>
                            <Clock size={14} /> {event.time}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="venue-cell">
                          <MapPin size={14} />
                          {event.venue}
                        </span>
                      </td>
                      <td>
                        <span className="registrations-count">
                          {eventRegistrations.length}
                        </span>
                      </td>
                      <td>
                        {isPast ? (
                          <span className="badge badge-warning">
                            Past
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            Upcoming
                          </span>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/faculty/events/${event._id}`}
                          className="btn btn-sm btn-outline"
                        >
                          Manage
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state card">
            <Calendar size={48} />
            <h3>No events created yet</h3>
            <p>Create your first event to get started</p>
            <Link to="/faculty/create-event" className="btn btn-primary">
              <Plus size={18} />
              Create Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
