const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  distanceKm: { type: Number, required: true }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  busType: { type: String, enum: ['micro', 'bus', 'electric', 'tempo'], default: 'micro' },
  stops: [{ type: String }],   // ordered list of stop names
  edges: [edgeSchema]          // connections with distances
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
