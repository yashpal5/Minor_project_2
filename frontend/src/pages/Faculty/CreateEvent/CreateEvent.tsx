import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import "./CreateEvent.css";

const API_BASE = "http://localhost:3000/api";

export const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    capacity: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.venue
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const eventDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      setError("Event date must be in the future");
      return;
    }

    if (!user) {
      setError("You must be logged in to create an event");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          venue: formData.venue,
          capacity: formData.capacity
            ? parseInt(formData.capacity)
            : undefined,
          department: user.department || "General",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      const createdEvent = await res.json();

      setSuccess(true);

      setTimeout(() => {
        navigate(`/faculty/events/${createdEvent._id}`);
      }, 1200);
    } catch (err) {
      setError("Something went wrong while creating the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="create-event-header">
        <h1>Create New Event</h1>
        <p className="text-secondary">
          Fill in the details to create a new event
        </p>
      </div>

      <div className="create-event-layout">
        <form
          onSubmit={handleSubmit}
          className="create-event-form card"
        >
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>
                Event created successfully! Redirecting…
              </span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} />
              Event Title *
            </label>
            <input
              name="title"
              type="text"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} />
              Description *
            </label>
            <textarea
              name="description"
              className="form-input form-textarea"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} /> Date *
              </label>
              <input
                name="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                disabled={isSubmitting}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} /> Time *
              </label>
              <input
                name="time"
                type="time"
                className="form-input"
                value={formData.time}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} /> Venue *
              </label>
              <input
                name="venue"
                type="text"
                className="form-input"
                value={formData.venue}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Users size={16} /> Capacity
              </label>
              <input
                name="capacity"
                type="number"
                className="form-input"
                value={formData.capacity}
                onChange={handleChange}
                disabled={isSubmitting}
                min="1"
              />
              <span className="form-hint">
                Leave empty for unlimited capacity
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Creating…
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>

        <div className="create-event-tips">
          <div className="tips-card card">
            <h3>Tips for Creating Events</h3>
            <ul>
              <li>
                <strong>Clear Title:</strong> Use a
                descriptive title.
              </li>
              <li>
                <strong>Detailed Description:</strong>{" "}
                Include agenda and outcomes.
              </li>
              <li>
                <strong>Accurate Timing:</strong> Avoid
                conflicts.
              </li>
              <li>
                <strong>Venue Details:</strong> Be specific.
              </li>
              <li>
                <strong>Capacity:</strong> Prevent overbooking.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
