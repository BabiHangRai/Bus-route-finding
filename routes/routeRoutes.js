const express = require('express');
const router = express.Router();
const { searchRoute, getAllStops, getAllRoutes, getStopDetails } = require('../controllers/routeController');

router.post('/search', searchRoute);
router.get('/stops', getAllStops);
router.get('/all', getAllRoutes);
router.get('/stop/:name', getStopDetails);

module.exports = router;
