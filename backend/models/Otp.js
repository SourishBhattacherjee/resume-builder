const mongoose = require('mongoose')
const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  Otp: { type: String, required: true },
  expires: { type: Date, required: true }
});

OtpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otp', OtpSchema);
module.exports = Otp;