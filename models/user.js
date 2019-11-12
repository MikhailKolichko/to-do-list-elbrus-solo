const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  fb_id: String,
  access_token:String,
  userName: String,
  email: String,
  password: String,
  parties: [],
});

module.exports = model('User', userSchema);
