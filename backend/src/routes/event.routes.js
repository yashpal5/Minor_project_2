const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

const router = express.Router();

// Helper: transform event doc to include createdByName
const formatEvent = (event) => {
  const obj = event.toJSON ? event.toJSON() : { ...event };
  if (event.createdBy && typeof event.createdBy === "object") {
    obj.createdByName = event.createdBy.name || "Unknown";
    obj.createdBy = event.createdBy._id.toString();
  }
  return obj;
};

/* ===================== GET ALL EVENTS ===================== */
router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email department")
      .sort({ createdAt: -1 });

    const formatted = events.map(formatEvent);
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===================== GET SINGLE EVENT ===================== */
router.get("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email department"
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json(formatEvent(event));
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===================== CREATE EVENT (FACULTY ONLY) ===================== */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, description, date, time, venue, capacity, department } = req.body;

    if (!title || !date || !time || !venue) {
      return res
        .status(400)
        .json({ success: false, message: "Title, date, time, and venue are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      capacity,
      department: department || "General",
      createdBy: req.user.id,
    });

    // Re-fetch with populate so response includes createdByName
    const populated = await Event.findById(event._id).populate(
      "createdBy",
      "name email department"
    );

    res.status(201).json(formatEvent(populated));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===================== UPDATE EVENT ===================== */
router.patch("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Only the creator can update
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not your event" });
    }

    const allowedFields = ["title", "description", "date", "time", "venue", "capacity", "department", "isAttendanceLocked"];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    }

    await event.save();
    res.json({ success: true, message: "Event updated", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===================== DELETE EVENT ===================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not your event" });
    }

    // Clean up related data
    await Registration.deleteMany({ eventId: event._id });
    await Attendance.deleteMany({ eventId: event._id });
    await Event.findByIdAndDelete(event._id);

    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===================== GET EVENT REGISTRATIONS ===================== */
router.get("/:id/registrations", auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id })
      .populate("studentId", "name email rollNumber");

    // Flatten populated data for frontend compatibility
    const formatted = registrations.map((r) => {
      const obj = r.toJSON();
      return {
        ...obj,
        _id: obj._id,
        id: obj._id,
        eventId: obj.eventId?.toString() || obj.eventId,
        studentId: obj.studentId?._id?.toString() || obj.studentId,
        studentName: obj.studentId?.name || "Unknown",
        studentEmail: obj.studentId?.email || "",
        studentRollNumber: obj.studentId?.rollNumber || "N/A",
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
