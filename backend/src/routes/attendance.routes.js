const express = require("express");
const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");
const auth = require("../middleware/auth");
const sendAttendanceEmail = require("../utils/sendEmail");

const router = express.Router();

/* FACULTY: BULK SAVE ATTENDANCE */
router.post("/bulk", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const entries = req.body; // array of { eventId, studentId, status }

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: "Attendance data required" });
    }

    for (const entry of entries) {
      // Normalize status to title-case for DB consistency
      const status =
        entry.status === "present" ? "Present" :
        entry.status === "absent" ? "Absent" :
        entry.status; // pass through if already correct

      if (status !== "Present" && status !== "Absent") continue; // skip not_marked

      await Attendance.findOneAndUpdate(
        { eventId: entry.eventId, studentId: entry.studentId },
        { status },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* FACULTY: MARK ATTENDANCE (legacy single-event format) */
router.post("/:eventId", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { attendance } = req.body;
    const { eventId } = req.params;

    if (!Array.isArray(attendance)) {
      return res.status(400).json({ success: false, message: "attendance array required" });
    }

    for (const entry of attendance) {
      await Attendance.findOneAndUpdate(
        { eventId, studentId: entry.studentId },
        { status: entry.status },
        { upsert: true }
      );
    }

    res.json({ success: true, message: "Attendance saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* FACULTY: SEND EMAIL REPORT */
router.post("/:eventId/email", auth, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await sendAttendanceEmail(req.params.eventId);
    res.json({ success: true, message: "Attendance report sent via email" });
  } catch (error) {
    console.error("Email send error:", error.message);
    // Don't fail the request if email fails — just report it
    res.json({ success: false, message: "Email sending failed: " + error.message });
  }
});

/* GET ATTENDANCE FOR AN EVENT */
router.get("/:eventId", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ eventId: req.params.eventId });

    // Return with studentId as string and lowercase status for frontend
    const formatted = records.map((a) => ({
      _id: a._id,
      eventId: a.eventId.toString(),
      studentId: a.studentId.toString(),
      status: a.status.toLowerCase(), // "present" / "absent"
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* STUDENT: GET MY ATTENDANCE */
router.get("/my/records", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user.id });

    const formatted = records.map((a) => ({
      _id: a._id,
      eventId: a.eventId.toString(),
      studentId: a.studentId.toString(),
      status: a.status.toLowerCase(),
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
