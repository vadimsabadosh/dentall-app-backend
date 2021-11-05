const { Appointment, Patient } = require("../models");
const { groupBy, reduce } = require("lodash");

function AppointmentController() {}
const create = async function (req, res) {
  const data = {
    patient: req.body.patient,
    tooth_number: req.body.tooth_number,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };
  const patient = await Patient.findOne({ _id: data.patient });

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "PATIENT_NOT_FOUND",
    });
  }

  Appointment.create(data, function (err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    return res.status(201).json({
      success: true,
      data: doc,
    });
  });
};
const update = async function (req, res) {
  const appointmentId = req.params.id;
  const data = {
    patient: req.body.patient,
    tooth_number: req.body.tooth_number,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  const appointment = await Appointment.findOne({ _id: appointmentId });

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "APPOINTMENT_NOT_FOUND",
    });
  }

  Appointment.findByIdAndUpdate(
    appointmentId,
    { $set: { ...data } },
    { new: true },
    function (err, doc) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        });
      }

      return res.json({
        success: true,
        data: doc,
      });
    }
  );
};

const remove = async function (req, res) {
  const id = req.params.id;
  console.log(": AppointmentController -> id", id);

  const appointment = await Appointment.findById(id);
  console.log(": AppointmentController -> appointment", appointment);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "APPOINTMENT_NOT_FOUND",
    });
  }

  Appointment.deleteOne({ _id: id }, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    return res.json({
      success: true,
      message: "DELETED_SUCCESSFULLY",
    });
  });
};
const all = function (_, res) {
  Appointment.find({})
    .populate("patient")
    .exec(function (err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        });
      }

      return res.json({
        success: true,
        data: reduce(
          groupBy(docs, "date"),
          (result, value, key) => {
            result = [...result, { title: key, data: value }];
            return result;
          },
          []
        ),
      });
    });
};
AppointmentController.prototype = {
  create,
  all,
  update,
  remove,
};
module.exports = AppointmentController;
