const mongoose = require('mongoose');
const formDataSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "pic/Avatar.png", // Default profile picture
  },
  language: {
    type: String,
    default: 'English', // Default language
  },
  notifications: {
    type: Boolean,
    default: true, // Default to notifications enabled
  },
  password: {
    type: String,
    required: true,
    max: 8,
  },
  passwordResetToken: {
    type: String,
    // default: null,
  },
  passwordResetExpires: {
      type: Date,
      // default: null,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
    default: 'This is my bio', // Default bio
  },
}, { timestamps: true });

const FormData = mongoose.model('FormData', formDataSchema);
module.exports = FormData;