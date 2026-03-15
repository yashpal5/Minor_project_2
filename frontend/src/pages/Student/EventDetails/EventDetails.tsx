import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Building2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import "./EventDetails.css";

const API_BASE = "http://localhost:3000/api";

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const eventRes = await fetch(`${API_BASE}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      if (user) {
        setIsRegistered(
          regData.some((r: any) => r.studentId === user.id)
        );
      }

      const attRes = await fetch(
        `${API_BASE}/attendance/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const attData = await attRes.json();
      setAttendance(attData);
    };

    fetchData();
  }, [eventId, user]);

  const registrationCount = registrations.length;

  const attendanceStatus = useMemo(() => {
    if (!user) return null;
    const record = attendance.find(
      (a) => a.studentId === user.id
    );
    return record?.status || null;
  }, [attendance, user]);

  const handleRegister = async () => {
    if (!user || !event) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      if (
        event.capacity &&
        registrations.length >= event.capacity
      ) {
        setMessage({
          type: "error",
          text: "Sorry, this event is fully booked.",
        });
        setIsLoading(false);
        return;
      }

      await fetch(`${API_BASE}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
        }),
      });

      setIsRegistered(true);
      setMessage({
        type: "success",
        text: "Successfully registered for the event!",
      });

      setRegistrations((prev) => [
        ...prev,
        { studentId: user.id },
      ]);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to register. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user || !event) return;

    if (
      !confirm(
        "Are you sure you want to cancel your registration?"
      )
    )
      return;

    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${API_BASE}/registrations/${event._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsRegistered(false);
      setRegistrations((prev) =>
        prev.filter((r) => r.studentId !== user.id)
      );
      setMessage({
        type: "success",
        text: "Registration cancelled successfully.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to cancel registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  const isPast = isBefore(parseISO(event.date), new Date());
  const spotsLeft = event.capacity
    ? event.capacity - registrationCount
    : null;
  const isFull =
    event.capacity &&
    registrationCount >= event.capacity;

  return (
    <div className="page-container">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <ArrowLeft size={20} />
        Back to Events
      </button>

      <div className="event-details-layout">
        <div className="event-main">
          <div className="event-details-card card">
            <div className="event-badges">
              <span className="badge badge-primary">
                {event.department}
              </span>
              {isPast && (
                <span className="badge badge-warning">
                  Past Event
                </span>
              )}
              {isRegistered && (
                <span className="badge badge-success">
                  Registered
                </span>
              )}
              {isFull && !isRegistered && (
                <span className="badge badge-error">
                  Fully Booked
                </span>
              )}
            </div>

            <h1>{event.title}</h1>

            <div className="event-meta-grid">
              <div className="meta-item">
                <Calendar size={20} />
                <div>
                  <span className="meta-label">
                    Date
                  </span>
                  <span className="meta-value">
                    {format(
                      parseISO(event.date),
                      "EEEE, MMMM d, yyyy"
                    )}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <Clock size={20} />
                <div>
                  <span className="meta-label">
                    Time
                  </span>
                  <span className="meta-value">
                    {event.time}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <MapPin size={20} />
                <div>
                  <span className="meta-label">
                    Venue
                  </span>
                  <span className="meta-value">
                    {event.venue}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <Users size={20} />
                <div>
                  <span className="meta-label">
                    Registrations
                  </span>
                  <span className="meta-value">
                    {registrationCount} registered
                    {spotsLeft !== null &&
                      ` • ${spotsLeft} spots left`}
                  </span>
                </div>
              </div>
            </div>

            <div className="event-section">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>

            <div className="event-section organizer-section">
              <h3>Organized By</h3>
              <div className="organizer-info">
                <div className="organizer-avatar">
                  <User size={24} />
                </div>
                <div>
                  <span className="organizer-name">
                    {event.createdByName}
                  </span>
                  <span className="organizer-dept">
                    <Building2 size={14} />
                    {event.department}
                  </span>
                </div>
              </div>
            </div>

            {attendanceStatus && (
              <div
                className={`attendance-status ${attendanceStatus}`}
              >
                {attendanceStatus ===
                "present" ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>
                      Your attendance has been
                      marked as{" "}
                      <strong>Present</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    <span>
                      Your attendance has been
                      marked as{" "}
                      <strong>Absent</strong>
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="event-sidebar">
          <div className="registration-card card">
            <h3>Registration</h3>

            {message && (
              <div
                className={`alert ${
                  message.type === "success"
                    ? "alert-success"
                    : "alert-error"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {isPast ? (
              <p>This event has already taken place.</p>
            ) : isRegistered ? (
              <>
                <button
                  onClick={handleCancelRegistration}
                  className="btn btn-outline btn-block"
                  disabled={
                    isLoading ||
                    event.isAttendanceLocked
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="spin"
                      />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Registration"
                  )}
                </button>
                {event.isAttendanceLocked && (
                  <p className="text-muted text-sm mt-2">
                    Registration cannot be cancelled
                    as attendance has been locked.
                  </p>
                )}
              </>
            ) : isFull ? (
              <p>This event is fully booked.</p>
            ) : (
              <button
                onClick={handleRegister}
                className="btn btn-primary btn-block btn-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="spin"
                    />
                    Registering...
                  </>
                ) : (
                  "Register Now"
                )}
              </button>
            )}
          </div>

          <div className="quick-links card">
            <h4>Quick Links</h4>
            <Link
              to="/student/events"
              className="quick-link"
            >
              <Calendar size={18} />
              Browse More Events
            </Link>
            <Link
              to="/student/my-registrations"
              className="quick-link"
            >
              <Users size={18} />
              My Registrations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
