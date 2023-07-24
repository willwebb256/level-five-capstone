// src/waiver.js
const mongoose = require('mongoose');

const waiverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateSigned: { type: Date, default: Date.now },
  isAdult: { type: Boolean, default: true },
  signatureData: { type: String, required: true },
});

module.exports = mongoose.model('Waiver', waiverSchema);

