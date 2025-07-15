const mongoose = require('mongoose')
const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }, // Changed from Otp to otp
  expires: { type: Date, required: true }
});
OtpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otp', OtpSchema);
module.exports = Otp;