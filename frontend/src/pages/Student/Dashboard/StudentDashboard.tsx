import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import "./StudentDashboard.css";

const API_BASE = "http://localhost:3000/api";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const [eventRes, regRes, attRes] = await Promise.all([
        fetch(`${API_BASE}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/registrations/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/attendance/my/records`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setEvents(await eventRes.json());
      setRegistrations(await regRes.json());
      setAttendance(await attRes.json());
    };

    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    if (!user) return null;

    const now = new Date();
    const registeredEventIds = registrations.map((r) => r.eventId);

    const upcomingRegistered = events.filter(
      (e) =>
        registeredEventIds.includes(e._id) &&
        isAfter(parseISO(e.date), now)
    );

    const attendedCount = attendance.filter(
      (a) => a.status === "present"
    ).length;

    return {
      registeredEvents: registrations.length,
      attendedEvents: attendedCount,
      upcomingRegisteredEvents: upcomingRegistered.length,
      upcomingEvents: upcomingRegistered.slice(0, 3),
    };
  }, [events, registrations, attendance, user]);

  const recentEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => isAfter(parseISO(e.date), now))
      .sort(
        (a, b) =>
          parseISO(a.date).getTime() -
          parseISO(b.date).getTime()
      )
      .slice(0, 4);
  }, [events]);

  if (!user || !stats) return null;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name.split(" ")[0]}! 👋</h1>
          <p className="text-secondary">
            Here's your event activity overview
          </p>
        </div>
        <Link to="/student/events" className="btn btn-primary">
          Browse Events
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* STATS */}
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
            <span className="stat-value">
              {stats.registeredEvents}
            </span>
            <span className="stat-label">
              Registered Events
            </span>
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
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.attendedEvents}
            </span>
            <span className="stat-label">
              Events Attended
            </span>
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
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {stats.upcomingRegisteredEvents}
            </span>
            <span className="stat-label">
              Upcoming Registrations
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* UPCOMING REGISTERED */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <ClipboardCheck size={22} />
              Your Upcoming Events
            </h2>
            <Link
              to="/student/my-registrations"
              className="btn btn-ghost btn-sm"
            >
              View All
            </Link>
          </div>

          {stats.upcomingEvents.length > 0 ? (
            <div className="event-list">
              {stats.upcomingEvents.map((event: any) => (
                <Link
                  key={event._id}
                  to={`/student/events/${event._id}`}
                  className="event-list-item card"
                >
                  <div className="event-date-badge">
                    <span className="date-day">
                      {format(
                        parseISO(event.date),
                        "d"
                      )}
                    </span>
                    <span className="date-month">
                      {format(
                        parseISO(event.date),
                        "MMM"
                      )}
                    </span>
                  </div>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <div className="event-meta">
                      <span>
                        <Clock size={14} /> {event.time}
                      </span>
                      <span>
                        <MapPin size={14} /> {event.venue}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="event-arrow"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <CalendarDays size={48} />
              <h3>No upcoming registered events</h3>
              <p>
                Browse and register for events to
                see them here
              </p>
              <Link
                to="/student/events"
                className="btn btn-primary"
              >
                Explore Events
              </Link>
            </div>
          )}
        </div>

        {/* DISCOVER */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Calendar size={22} />
              Discover Events
            </h2>
            <Link
              to="/student/events"
              className="btn btn-ghost btn-sm"
            >
              View All
            </Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="discover-events">
              {recentEvents.map((event: any) => (
                <Link
                  key={event._id}
                  to={`/student/events/${event._id}`}
                  className="discover-event-card card"
                >
                  <div className="discover-event-header">
                    <span className="badge badge-primary">
                      {event.department}
                    </span>
                    <span className="event-date">
                      {format(
                        parseISO(event.date),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                  <h4>{event.title}</h4>
                  <p>
                    {event.description.substring(0, 80)}
                    ...
                  </p>
                  <div className="discover-event-footer">
                    <span>
                      <MapPin size={14} /> {event.venue}
                    </span>
                    <span>
                      <Clock size={14} /> {event.time}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <Calendar size={48} />
              <h3>No upcoming events</h3>
              <p>Check back later for new events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
