const express = require('express');
const router = express.Router();
const { addStop, deleteStop, addRoute, updateRoute, deleteRoute } = require('../controllers/adminController');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

router.post('/stop', isLoggedIn, isAdmin, addStop);
router.delete('/stop/:id', isLoggedIn, isAdmin, deleteStop);
router.post('/route', isLoggedIn, isAdmin, addRoute);
router.put('/route/:id', isLoggedIn, isAdmin, updateRoute);
router.delete('/route/:id', isLoggedIn, isAdmin, deleteRoute);

module.exports = router;
