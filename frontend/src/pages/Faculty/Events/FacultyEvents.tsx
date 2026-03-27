import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import "./FacultyEvents.css";

const API_BASE = "http://localhost:3000/api";

export const FacultyEvents: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "past"
  >("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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

      // Fetch registrations & attendance
      const regPromises = facultyEvents.map((e: any) =>
        fetch(`${API_BASE}/events/${e._id}/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      );

      const attendancePromises = facultyEvents.map((e: any) =>
        fetch(`${API_BASE}/attendance/${e._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      );

      setRegistrations((await Promise.all(regPromises)).flat());
      setAttendance((await Promise.all(attendancePromises)).flat());
    };

    fetchData();
  }, [user]);

  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase());

        const eventDate = parseISO(event.date);
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "upcoming" && isAfter(eventDate, now)) ||
          (filterStatus === "past" && !isAfter(eventDate, now));

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          parseISO(b.date).getTime() -
          parseISO(a.date).getTime()
      );
  }, [events, searchTerm, filterStatus]);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_BASE}/events/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setEvents((prev) => prev.filter((e) => e._id !== eventId));
    setActiveMenu(null);
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <div className="faculty-events-header">
        <div>
          <h1>My Events</h1>
          <p className="text-secondary">Manage your created events</p>
        </div>
        <Link to="/faculty/create-event" className="btn btn-primary">
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      <div className="events-filters card">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-tabs">
          {["all", "upcoming", "past"].map((status) => (
            <button
              key={status}
              className={`status-tab ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() =>
                setFilterStatus(status as "all" | "upcoming" | "past")
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="events-list">
          {filteredEvents.map((event) => {
            const eventRegs = registrations.filter(
              (r) => r.eventId === event._id
            );
            const eventAttendance = attendance.filter(
              (a) => a.eventId === event._id
            );
            const presentCount = eventAttendance.filter(
              (a) => a.status === "Present"
            ).length;
            const isPast = !isAfter(
              parseISO(event.date),
              new Date()
            );

            return (
              <div key={event._id} className="event-row card">
                <div className="event-main-info">
                  <div className="event-date-badge">
                    <span className="date-day">
                      {format(parseISO(event.date), "d")}
                    </span>
                    <span className="date-month">
                      {format(parseISO(event.date), "MMM")}
                    </span>
                  </div>

                  <div className="event-details">
                    <div className="event-title-row">
                      <h3>{event.title}</h3>
                      <span
                        className={`badge ${
                          isPast
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {isPast ? "Past" : "Upcoming"}
                      </span>
                    </div>

                    <div className="event-meta">
                      <span>
                        <Clock size={14} /> {event.time}
                      </span>
                      <span>
                        <MapPin size={14} /> {event.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="event-stats">
                  <div className="stat-item">
                    <Users size={18} />
                    <span>{eventRegs.length} registered</span>
                  </div>
                  <div className="stat-item">
                    <ClipboardCheck size={18} />
                    <span>{presentCount} present</span>
                  </div>
                </div>

                <div className="event-actions">
                  <Link
                    to={`/faculty/events/${event._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Eye size={16} />
                    Manage
                  </Link>

                  <div className="dropdown">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === event._id
                            ? null
                            : event._id
                        )
                      }
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === event._id && (
                      <>
                        <div
                          className="dropdown-overlay"
                          onClick={() => setActiveMenu(null)}
                        />
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item danger"
                            onClick={() =>
                              handleDelete(event._id)
                            }
                          >
                            <Trash2 size={16} />
                            Delete Event
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state card">
          <CalendarDays size={64} />
          <h3>No events found</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter"
              : "Create your first event to get started"}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Link to="/faculty/create-event" className="btn btn-primary">
              <Plus size={18} />
              Create Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
