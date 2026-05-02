/**
 * ALGORITHM 1: Dijkstra's Shortest Path Algorithm
 *
 * Finds the shortest (minimum distance) path between two bus stops
 * in the Kathmandu Valley bus network graph.
 *
 * Time Complexity:  O((V + E) log V)
 * Space Complexity: O(V)
 *
 * @param {Object} graph  - Adjacency list: { stopName: { neighbor: distanceKm } }
 * @param {string} source - Starting stop name
 * @param {string} target - Destination stop name
 * @returns {Object}      - { path, totalDistance, found }
 */
function dijkstra(graph, source, target) {
  // Distance map — all infinity except source
  const distances = {};
  const previous = {};       // To reconstruct the path
  const visited = new Set();

  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[source] = 0;

  // Simple priority queue using array (sorted by distance)
  const queue = [{ node: source, dist: 0 }];

  while (queue.length > 0) {
    // Sort to get minimum distance node (acts like a min-heap)
    queue.sort((a, b) => a.dist - b.dist);
    const { node: current } = queue.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    // Stop early if we reached the target
    if (current === target) break;

    if (!graph[current]) continue;

    // Explore neighbors
    for (const [neighbor, weight] of Object.entries(graph[current])) {
      if (visited.has(neighbor)) continue;

      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        queue.push({ node: neighbor, dist: newDist });
      }
    }
  }

  // Reconstruct path from target back to source
  if (distances[target] === Infinity) {
    return { path: [], totalDistance: 0, found: false };
  }

  const path = [];
  let current = target;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    totalDistance: parseFloat(distances[target].toFixed(2)),
    found: true
  };
}

module.exports = dijkstra;
