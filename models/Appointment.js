const mongoose = require("mongoose");
const { Schema } = mongoose;

const AppointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
    tooth_number: Number,
    diagnosis: String,
    price: Number,
    date: String,
    time: String,
  },
  { timestamps: true }
);

const Appointment = new mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
