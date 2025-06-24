const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  messName: String,
  ownerName: String,
  email: String,
  password: String,
  address: String,
  mobile: String,
  description: String,
  images: [String]
});

module.exports = mongoose.model('Owner', OwnerSchema);
