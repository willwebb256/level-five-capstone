const mongoose = require('mongoose');

const waiverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateSigned: { type: Date, default: Date.now },
  isAdult: { type: Boolean, default: true },
  signatureData: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  zipCode: { type: String, required: true },
  electronicConsent: { type: Boolean, required: true },
});

module.exports = mongoose.model('Waiver', waiverSchema);

