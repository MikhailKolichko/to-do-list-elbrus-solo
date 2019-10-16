const { Schema, model } = require('mongoose');

const partySchema = new Schema({
  location: String,
  details: String,
  host: Object,
  date: String,
  guests: [],
});

module.exports = model('Party', partySchema);
