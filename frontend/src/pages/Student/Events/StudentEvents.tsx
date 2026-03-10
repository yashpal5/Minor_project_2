import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CalendarDays,
} from "lucide-react";
import {
  format,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import "./StudentEvents.css";

const API_BASE = "http://localhost:3000/api";

export const StudentEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "past"
  >("upcoming");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const eventsRes = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      if (user) {
        const regRes = await fetch(
          `${API_BASE}/registrations/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const regData = await regRes.json();
        setRegistrations(regData);
      }
    };

    fetchData();
  }, [user]);

  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events
      .filter((event) => {
        const matchesSearch =
          event.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.venue
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesDepartment =
          !filterDepartment ||
          event.department === filterDepartment;

        const eventDate = parseISO(event.date);
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "upcoming" &&
            isAfter(eventDate, now)) ||
          (filterStatus === "past" &&
            isBefore(eventDate, now));

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus
        );
      })
      .sort(
        (a, b) =>
          parseISO(a.date).getTime() -
          parseISO(b.date).getTime()
      );
  }, [
    events,
    searchTerm,
    filterDepartment,
    filterStatus,
  ]);

  const departments = useMemo(() => {
    return [...new Set(events.map((e) => e.department))];
  }, [events]);

  const isStudentRegistered = (eventId: string) => {
    return registrations.some(
      (r) => r.eventId === eventId
    );
  };

  return (
    <div className="page-container">
      <div className="events-header">
        <div>
          <h1>Browse Events</h1>
          <p className="text-secondary">
            Discover and register for college events
          </p>
        </div>
      </div>

      <div className="events-filters card">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search events by title, description, or venue..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <Filter size={18} />
            <select
              className="form-input form-select"
              value={filterDepartment}
              onChange={(e) =>
                setFilterDepartment(e.target.value)
              }
            >
              <option value="">
                All Departments
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="status-tabs">
            {["upcoming", "past", "all"].map(
              (status) => (
                <button
                  key={status}
                  className={`status-tab ${
                    filterStatus === status
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setFilterStatus(
                      status as
                        | "all"
                        | "upcoming"
                        | "past"
                    )
                  }
                >
                  {status
                    .charAt(0)
                    .toUpperCase() +
                    status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map((event) => {
            const registered =
              user && isStudentRegistered(event._id);
            const eventRegs = registrations.filter(
              (r) => r.eventId === event._id
            );
            const spotsLeft = event.capacity
              ? event.capacity - eventRegs.length
              : null;
            const isPast = isBefore(
              parseISO(event.date),
              new Date()
            );

            return (
              <Link
                key={event._id}
                to={`/student/events/${event._id}`}
                className="event-card card"
              >
                <div className="event-card-header">
                  <span className="badge badge-primary">
                    {event.department}
                  </span>
                  {registered && (
                    <span className="badge badge-success">
                      Registered
                    </span>
                  )}
                  {isPast && (
                    <span className="badge badge-warning">
                      Past
                    </span>
                  )}
                </div>

                <h3>{event.title}</h3>
                <p className="event-description">
                  {event.description}
                </p>

                <div className="event-card-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>
                      {format(
                        parseISO(event.date),
                        "EEEE, MMMM d, yyyy"
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{event.venue}</span>
                  </div>
                  <div className="detail-item">
                    <Users size={16} />
                    <span>
                      {eventRegs.length} registered
                      {spotsLeft !== null &&
                        ` • ${spotsLeft} spots left`}
                    </span>
                  </div>
                </div>

                <div className="event-card-footer">
                  <span className="organizer">
                    By {event.createdByName}
                  </span>
                  <span className="view-details">
                    View Details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state card">
          <CalendarDays size={64} />
          <h3>No events found</h3>
          <p>
            Try adjusting your search or filter
            criteria
          </p>
        </div>
      )}
    </div>
  );
};
