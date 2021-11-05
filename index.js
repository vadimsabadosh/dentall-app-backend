const express = require("express");
const cors = require("cors");
const PORT = 4000;
const mongoose = require("./core/db");

const { PatientCtrl, AppointmentCtrl } = require("./controllers");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/patients", PatientCtrl.all);
app.post("/patients", PatientCtrl.create);
app.delete("/patients/:id", PatientCtrl.remove);
app.patch("/patients/:id", PatientCtrl.update);
app.get("/patients/:id", PatientCtrl.show);

app.get("/appointments", AppointmentCtrl.all);
app.post("/appointments", AppointmentCtrl.create);
app.delete("/appointments/:id", AppointmentCtrl.remove);
app.patch("/appointments/:id", AppointmentCtrl.update);

app.listen(PORT, function (err) {
  if (err) {
    throw Error(err);
  }
  console.log("Server started at port: " + PORT);
});

const connection = mongoose.connection;
connection.on("error", (err) => console.log("Connection error" + err));
connection.once("open", () => console.log("Connected to DB"));
