const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Replace bcrypt with bcryptjs

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  gender: String
});

// Before saving the user, hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
