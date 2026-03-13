const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: String,
  time: String,
  venue: String,
  capacity: Number,
  department: {
    type: String,
    default: "General",
  },
  isAttendanceLocked: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
