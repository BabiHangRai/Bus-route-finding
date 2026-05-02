const express = require('express');
const router = express.Router();
const { getHistory, getSaved, saveRoute, deleteSaved } = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/history', isLoggedIn, getHistory);
router.get('/saved', isLoggedIn, getSaved);
router.post('/save', isLoggedIn, saveRoute);
router.delete('/saved/:index', isLoggedIn, deleteSaved);

module.exports = router;
