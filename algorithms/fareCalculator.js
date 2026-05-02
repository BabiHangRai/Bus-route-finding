/**
 * ALGORITHM 3: Fare Calculation Algorithm
 *
 * Calculates estimated bus/micro fare based on Nepal's public
 * transport fare structure (simplified).
 *
 * Rules:
 *   Base fare     = Rs. 15 for first 5 km
 *   Extra         = Rs. 2 per km beyond 5 km
 *   Electric bus  = 1.2x multiplier
 *   Transfer      = Additional Rs. 15 base fare for second bus
 *   Student card  = 50% discount on total
 *
 * @param {number}  distanceKm  - Total route distance in km
 * @param {string}  busType     - 'micro' | 'bus' | 'electric' | 'tempo'
 * @param {boolean} isStudent   - Whether passenger has student card
 * @param {boolean} hasTransfer - Whether route involves a bus transfer
 * @returns {Object}            - { baseFare, extraFare, transferFare, discount, totalFare, breakdown }
 */
function calculateFare(distanceKm, busType = 'micro', isStudent = false, hasTransfer = false) {
  const BASE_FARE = 15;          // Rs. for first 5 km
  const BASE_KM_LIMIT = 5;      // km included in base fare
  const RATE_PER_KM = 2;        // Rs. per km after limit
  const ELECTRIC_MULTIPLIER = 1.2;
  const TRANSFER_BASE = 15;     // Second bus boarding charge
  const STUDENT_DISCOUNT = 0.5; // 50% off

  // Step 1: Base fare
  let baseFare = BASE_FARE;

  // Step 2: Extra distance charge
  let extraFare = 0;
  if (distanceKm > BASE_KM_LIMIT) {
    extraFare = (distanceKm - BASE_KM_LIMIT) * RATE_PER_KM;
  }

  let subtotal = baseFare + extraFare;

  // Step 3: Electric bus multiplier
  if (busType === 'electric') {
    subtotal = subtotal * ELECTRIC_MULTIPLIER;
  }

  // Step 4: Transfer fare
  let transferFare = 0;
  if (hasTransfer) {
    transferFare = TRANSFER_BASE;
    subtotal += transferFare;
  }

  // Step 5: Student discount
  let discount = 0;
  if (isStudent) {
    discount = subtotal * STUDENT_DISCOUNT;
    subtotal = subtotal - discount;
  }

  const totalFare = Math.round(subtotal);

  // Estimated time: average speed 20 km/h in Kathmandu traffic
  const estimatedMinutes = Math.round((distanceKm / 20) * 60);

  return {
    baseFare: BASE_FARE,
    extraFare: parseFloat(extraFare.toFixed(2)),
    transferFare,
    discount: parseFloat(discount.toFixed(2)),
    totalFare,
    estimatedMinutes,
    breakdown: `Base Rs.${BASE_FARE} + Extra Rs.${extraFare.toFixed(0)}${hasTransfer ? ` + Transfer Rs.${TRANSFER_BASE}` : ''}${isStudent ? ` - Student Discount Rs.${discount.toFixed(0)}` : ''} = Rs.${totalFare}`
  };
}

module.exports = calculateFare;
