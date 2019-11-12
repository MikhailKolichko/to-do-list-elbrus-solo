const { Schema, model } = require('mongoose');

const pointSchema = new Schema({
  location: [],
  host:[],
  event_id: [],
});

module.exports = model('Point', pointSchema);
