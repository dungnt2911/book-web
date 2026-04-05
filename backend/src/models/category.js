const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true }, 
  description: String,
  status: { type: String, default: 'active' } 
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
