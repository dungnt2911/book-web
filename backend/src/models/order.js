const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{
    book:  { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    qty:   { type: Number, default: 1 },
    price: { type: Number }
  }],
  shippingAddress: {
    name:     String,
    phone:    String,
    email:    String,
    address:  String,
    city:     String,
    district: String
  },
  paymentMethod: { type: String, default: 'cod' },
  note:          { type: String },
  total:         { type: Number },
  status:        { type: String, default: 'pending' },
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);