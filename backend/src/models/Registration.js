const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Frontend reads "registeredAt" — alias createdAt
registrationSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.registeredAt = ret.createdAt;
    return ret;
  },
});

module.exports = mongoose.model("Registration", registrationSchema);
