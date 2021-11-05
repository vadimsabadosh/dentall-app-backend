const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Doctor:p4$$w0rd@cluster0.kuzhq.mongodb.net/dental?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

module.exports = mongoose;
