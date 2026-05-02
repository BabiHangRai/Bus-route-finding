const User = require('../models/User');

// GET /api/user/history
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('searchHistory');
    res.json({ success: true, history: user.searchHistory.reverse() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// GET /api/user/saved
exports.getSaved = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('savedRoutes name isStudent');
    res.json({ success: true, savedRoutes: user.savedRoutes, name: user.name, isStudent: user.isStudent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved routes' });
  }
};

// POST /api/user/save
exports.saveRoute = async (req, res) => {
  try {
    const { from, to, label } = req.body;
    await User.findByIdAndUpdate(req.session.userId, {
      $push: { savedRoutes: { from, to, label: label || `${from} → ${to}` } }
    });
    res.json({ success: true, message: 'Route saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save route' });
  }
};

// DELETE /api/user/saved/:index
exports.deleteSaved = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    user.savedRoutes.splice(req.params.index, 1);
    await user.save();
    res.json({ success: true, message: 'Saved route removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete saved route' });
  }
};
