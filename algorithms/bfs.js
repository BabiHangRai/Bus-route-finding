/**
 * ALGORITHM 2: BFS Transfer Detection Algorithm
 *
 * Uses Breadth-First Search to find whether a direct bus route exists
 * between two stops. If not, identifies the best transfer stop where
 * the passenger should switch buses.
 *
 * Time Complexity:  O(V + E)
 * Space Complexity: O(V)
 *
 * @param {Array}  routes - Array of route objects from MongoDB
 * @param {string} source - Starting stop name
 * @param {string} target - Destination stop name
 * @returns {Object}      - { direct, transferStop, sourceRoute, targetRoute, path }
 */
function bfsTransferDetection(routes, source, target) {
  // Build a map: stopName -> [ { routeNumber, allStops } ]
  const stopRouteMap = {};

  for (const route of routes) {
    for (const stop of route.stops) {
      if (!stopRouteMap[stop]) stopRouteMap[stop] = [];
      stopRouteMap[stop].push({
        routeNumber: route.routeNumber,
        routeName: route.name,
        busType: route.busType,
        stops: route.stops
      });
    }
  }

  // Check for direct route: source and target on the same bus
  const sourceRoutes = stopRouteMap[source] || [];
  for (const routeInfo of sourceRoutes) {
    if (routeInfo.stops.includes(target)) {
      // Direct route found
      const idx1 = routeInfo.stops.indexOf(source);
      const idx2 = routeInfo.stops.indexOf(target);
      const pathStops = idx1 < idx2
        ? routeInfo.stops.slice(idx1, idx2 + 1)
        : routeInfo.stops.slice(idx2, idx1 + 1).reverse();

      return {
        direct: true,
        transferStop: null,
        sourceRoute: routeInfo,
        targetRoute: null,
        path: pathStops
      };
    }
  }

  // BFS to find a 1-transfer solution
  // Queue stores: { stop, routeTaken, visitedStops }
  const queue = [];
  const visitedStops = new Set([source]);

  // Enqueue all stops reachable from source on any single bus
  for (const routeInfo of sourceRoutes) {
    for (const stop of routeInfo.stops) {
      if (stop !== source && !visitedStops.has(stop)) {
        visitedStops.add(stop);
        queue.push({
          stop,
          sourceRoute: routeInfo,
          path: [source, stop]
        });
      }
    }
  }

  // BFS level by level
  while (queue.length > 0) {
    const { stop: currentStop, sourceRoute, path } = queue.shift();

    // Check if any bus from currentStop reaches the target
    const currentRoutes = stopRouteMap[currentStop] || [];
    for (const routeInfo of currentRoutes) {
      if (routeInfo.stops.includes(target)) {
        // Transfer found at currentStop
        const idx1 = routeInfo.stops.indexOf(currentStop);
        const idx2 = routeInfo.stops.indexOf(target);
        const secondLeg = idx1 < idx2
          ? routeInfo.stops.slice(idx1, idx2 + 1)
          : routeInfo.stops.slice(idx2, idx1 + 1).reverse();

        // Merge paths (remove duplicate transfer stop)
        const fullPath = [...path, ...secondLeg.slice(1)];

        return {
          direct: false,
          transferStop: currentStop,
          sourceRoute: sourceRoute,
          targetRoute: routeInfo,
          path: fullPath
        };
      }
    }

    // Expand to more stops via different buses
    for (const routeInfo of currentRoutes) {
      for (const stop of routeInfo.stops) {
        if (!visitedStops.has(stop)) {
          visitedStops.add(stop);
          queue.push({
            stop,
            sourceRoute,
            path: [...path, stop]
          });
        }
      }
    }
  }

  // No route found even with transfer
  return {
    direct: false,
    transferStop: null,
    sourceRoute: null,
    targetRoute: null,
    path: []
  };
}

module.exports = bfsTransferDetection;
