// Middleware: check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: 'Please log in first' });
}

// Middleware: check if user is admin
function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(403).json({ error: 'Admin access required' });
}

module.exports = { isLoggedIn, isAdmin };
