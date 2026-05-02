const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  zone: { type: String, enum: ['central', 'east', 'west', 'north', 'south'], default: 'central' },
  lat: { type: Number },
  lng: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Stop', stopSchema);
