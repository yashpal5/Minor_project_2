const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent",
  },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
