const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  username: String,
  messname: String,
  mobile: String,
  address: String,
  email: String
});

module.exports = mongoose.model('Verification', verificationSchema);
