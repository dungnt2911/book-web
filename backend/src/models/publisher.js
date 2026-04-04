const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Publisher', PublisherSchema);