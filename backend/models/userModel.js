const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);
module.exports = User;









// const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs'); // Replace bcrypt with bcryptjs

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
//   age: Number,
//   gender: String
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;
