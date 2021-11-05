const { Patient } = require("../models");
const { capitalize } = require("lodash");

function PatientController() {}
const create = async function (req, res) {
  const data = {
    username: capitalize(req.body.username),
    phone: req.body.phone,
  };
  if (!data.username || !data.phone) {
    return res.json({
      success: false,
      message: "FIELDS_CAN_NOT_BE_EMPTY",
    });
  }

  const patient = await Patient.findOne({ username: data.username });

  if (patient) {
    return res.json({
      success: false,
      message: "PATIENT_ALREADY_EXIST",
    });
  }

  Patient.create(data, function (err, doc) {
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
  const patientId = req.params.id;
  const data = {
    username: req.body.username,
    phone: req.body.phone,
  };

  const patient = await Patient.findOne({ _id: patientId });

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "PATIENT_NOT_FOUND",
    });
  }

  Patient.findByIdAndUpdate(
    patientId,
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

  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "PATIENT_NOT_FOUND",
    });
  }

  Patient.deleteOne({ _id: id }, function (err) {
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
const show = async function (req, res) {
  const id = req.params.id;
  try {
    const patient = await Patient.findById(id).populate("appointments").exec();
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "PATIENT_NOT_FOUND",
      });
    }
    return res.json({
      success: true,
      data: { ...patient._doc, appointments: patient.appointments },
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e,
    });
  }
};

const all = function (_, res) {
  Patient.find({}, function (err, docs) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    return res.json({
      success: true,
      data: docs,
    });
  });
};
PatientController.prototype = {
  create,
  all,
  remove,
  update,
  show,
};
module.exports = PatientController;
