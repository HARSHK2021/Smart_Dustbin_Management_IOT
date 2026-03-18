const mongoose = require('mongoose');

const dustbinSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['EMPTY', 'MEDIUM', 'FULL'],
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dustbin', dustbinSchema);
