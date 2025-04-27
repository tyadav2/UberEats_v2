const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 100 },
  country: { type: String, maxlength: 100 },
  phoneNumber: { type: String, maxlength: 15 },
  dob: { type: Date },
  password: { type: String, required: true },
  profilePic: { type: String } // URL to the profile picture
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
