const Route = require('../models/Route');
const Stop = require('../models/Stop');

// POST /api/admin/stop
exports.addStop = async (req, res) => {
  try {
    const { name, zone, lat, lng } = req.body;
    const stop = await Stop.create({ name, zone, lat, lng });
    res.json({ success: true, stop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/stop/:id
exports.deleteStop = async (req, res) => {
  try {
    await Stop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Stop deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/route
exports.addRoute = async (req, res) => {
  try {
    const { routeNumber, name, busType, stops } = req.body;
    // Auto-generate edges from ordered stops list
    const edges = [];
    for (let i = 0; i < stops.length - 1; i++) {
      edges.push({
        from: stops[i].name,
        to: stops[i + 1].name,
        distanceKm: stops[i].distanceToNext
      });
    }
    const stopNames = stops.map(s => s.name);
    const route = await Route.create({ routeNumber, name, busType, stops: stopNames, edges });
    res.json({ success: true, route });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/route/:id
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, route });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/route/:id
exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
