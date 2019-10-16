const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userName: String,
  email: String,
  password: String,
  parties: [],
});

module.exports = model('User', userSchema);
