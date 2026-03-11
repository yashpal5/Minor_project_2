const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

const router = express.Router();

/* STUDENT: REGISTER FOR EVENT */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can register" });
    }

    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check for duplicate
    const exists = await Registration.findOne({
      eventId,
      studentId: req.user.id,
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Already registered" });
    }

    // Check capacity
    if (event.capacity) {
      const count = await Registration.countDocuments({ eventId });
      if (count >= event.capacity) {
        return res.status(400).json({ success: false, message: "Event is fully booked" });
      }
    }

    await Registration.create({
      eventId,
      studentId: req.user.id,
    });

    res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* STUDENT: GET MY REGISTRATIONS */
router.get("/my", auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.user.id });

    // Return plain objects with eventId as string
    const formatted = registrations.map((r) => {
      const obj = r.toJSON();
      return {
        ...obj,
        _id: obj._id?.toString(),
        eventId: obj.eventId?.toString(),
        studentId: obj.studentId?.toString(),
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* STUDENT: CANCEL REGISTRATION */
router.delete("/:eventId", auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if attendance is locked
    const event = await Event.findById(eventId);
    if (event && event.isAttendanceLocked) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel — attendance has been locked",
      });
    }

    const result = await Registration.findOneAndDelete({
      eventId,
      studentId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    res.json({ success: true, message: "Registration cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
