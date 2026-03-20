const nodemailer = require("nodemailer");
const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAttendanceEmail = async (eventId) => {
  const event = await Event.findById(eventId).populate("createdBy");
  const attendance = await Attendance.find({ eventId }).populate("studentId");

  let report = "Name,Roll Number,Status\n";
  attendance.forEach((a) => {
    report += `${a.studentId.name},${a.studentId.rollNumber || "N/A"},${a.status}\n`;
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: event.createdBy.email,
    subject: `Attendance Report - ${event.title}`,
    text: report,
  });
};

module.exports = sendAttendanceEmail;
