const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);