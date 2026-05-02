const Route = require('../models/Route');
const Stop = require('../models/Stop');
const User = require('../models/User');
const dijkstra = require('../algorithms/dijkstra');
const bfsTransfer = require('../algorithms/bfs');
const calculateFare = require('../algorithms/fareCalculator');

// Build graph from all routes in DB
async function buildGraph() {
  const routes = await Route.find();
  const graph = {};

  for (const route of routes) {
    for (const edge of route.edges) {
      // Add both directions (undirected graph)
      if (!graph[edge.from]) graph[edge.from] = {};
      if (!graph[edge.to]) graph[edge.to] = {};
      graph[edge.from][edge.to] = edge.distanceKm;
      graph[edge.to][edge.from] = edge.distanceKm;
    }
  }
  return graph;
}

// POST /api/routes/search
exports.searchRoute = async (req, res) => {
  try {
    const { from, to, isStudent } = req.body;

    if (!from || !to) return res.status(400).json({ error: 'Please provide from and to stops' });
    if (from === to) return res.status(400).json({ error: 'Source and destination cannot be the same' });

    const routes = await Route.find();

    // Run Dijkstra for shortest path
    const graph = await buildGraph();
    const dijkstraResult = dijkstra(graph, from, to);

    if (!dijkstraResult.found) {
      return res.status(404).json({ error: `No route found between ${from} and ${to}` });
    }

    // Run BFS for transfer info
    const bfsResult = bfsTransfer(routes, from, to);

    // Calculate fare
    const busType = bfsResult.sourceRoute ? bfsResult.sourceRoute.busType : 'micro';
    const fareResult = calculateFare(
      dijkstraResult.totalDistance,
      busType,
      isStudent === true || isStudent === 'true',
      !bfsResult.direct
    );

    const result = {
      from,
      to,
      shortestPath: dijkstraResult.path,
      totalDistance: dijkstraResult.totalDistance,
      direct: bfsResult.direct,
      transferStop: bfsResult.transferStop,
      sourceRoute: bfsResult.sourceRoute ? {
        number: bfsResult.sourceRoute.routeNumber,
        name: bfsResult.sourceRoute.routeName,
        type: bfsResult.sourceRoute.busType
      } : null,
      targetRoute: bfsResult.targetRoute ? {
        number: bfsResult.targetRoute.routeNumber,
        name: bfsResult.targetRoute.routeName,
        type: bfsResult.targetRoute.busType
      } : null,
      fare: fareResult
    };

    // Save search to history if user is logged in
    if (req.session && req.session.userId) {
      await User.findByIdAndUpdate(req.session.userId, {
        $push: {
          searchHistory: {
            $each: [{ from, to, result, searchedAt: new Date() }],
            $slice: -20  // Keep last 20 searches
          }
        }
      });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during route search' });
  }
};

// GET /api/routes/stops — all stops
exports.getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find().sort({ name: 1 });
    res.json({ success: true, stops });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
};

// GET /api/routes/all — all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ routeNumber: 1 });
    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

// GET /api/routes/stop/:name — routes passing through a stop
exports.getStopDetails = async (req, res) => {
  try {
    const stopName = req.params.name;
    const routes = await Route.find({ stops: stopName });
    res.json({ success: true, stop: stopName, routes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stop details' });
  }
};
