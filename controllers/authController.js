const User = require('../models/User');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, isStudent } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password, isStudent: !!isStudent });
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.isAdmin = user.isAdmin;

    res.json({ success: true, message: 'Registered successfully', name: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.isAdmin = user.isAdmin;

    res.json({ success: true, message: 'Login successful', name: user.name, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ success: true, message: 'Logged out' }));
};

// GET /api/auth/me
exports.getMe = (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, name: req.session.userName, isAdmin: req.session.isAdmin });
  } else {
    res.json({ loggedIn: false });
  }
};
