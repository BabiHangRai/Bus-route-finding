const mongoose = require('mongoose');
require('dotenv').config();

const Stop = require('./models/Stop');
const Route = require('./models/Route');
const User = require('./models/User');

const stops = [
  { name: 'Ratnapark', zone: 'central', lat: 27.7041, lng: 85.3145 },
  { name: 'Tripureshwor', zone: 'central', lat: 27.6940, lng: 85.3140 },
  { name: 'Kalanki', zone: 'west', lat: 27.6939, lng: 85.2816 },
  { name: 'Kalimati', zone: 'west', lat: 27.6980, lng: 85.3000 },
  { name: 'Balkhu', zone: 'west', lat: 27.6826, lng: 85.2977 },
  { name: 'Lagankhel', zone: 'south', lat: 27.6651, lng: 85.3148 },
  { name: 'Pulchowk', zone: 'south', lat: 27.6780, lng: 85.3170 },
  { name: 'Jawalakhel', zone: 'south', lat: 27.6710, lng: 85.3130 },
  { name: 'Satdobato', zone: 'south', lat: 27.6595, lng: 85.3240 },
  { name: 'Baneshwor', zone: 'central', lat: 27.6938, lng: 85.3354 },
  { name: 'Koteshwor', zone: 'east', lat: 27.6797, lng: 85.3536 },
  { name: 'Tinkune', zone: 'east', lat: 27.6840, lng: 85.3490 },
  { name: 'Sinamangal', zone: 'east', lat: 27.6950, lng: 85.3520 },
  { name: 'Airport', zone: 'east', lat: 27.7000, lng: 85.3590 },
  { name: 'Jamal', zone: 'central', lat: 27.7050, lng: 85.3130 },
  { name: 'Lazimpat', zone: 'north', lat: 27.7200, lng: 85.3200 },
  { name: 'Maharajgunj', zone: 'north', lat: 27.7368, lng: 85.3346 },
  { name: 'Gongabu', zone: 'north', lat: 27.7350, lng: 85.3060 },
  { name: 'Samakhusi', zone: 'north', lat: 27.7300, lng: 85.3100 },
];

const routes = [
  {
    routeNumber: 'S1',
    name: 'Lagankhel - Gongabu',
    busType: 'bus',
    stops: ['Lagankhel', 'Pulchowk', 'Tripureshwor', 'Ratnapark', 'Jamal', 'Lazimpat', 'Maharajgunj', 'Gongabu'],
    edges: [
      { from: 'Lagankhel', to: 'Pulchowk', distanceKm: 2.0 },
      { from: 'Pulchowk', to: 'Tripureshwor', distanceKm: 3.0 },
      { from: 'Tripureshwor', to: 'Ratnapark', distanceKm: 2.0 },
      { from: 'Ratnapark', to: 'Jamal', distanceKm: 1.0 },
      { from: 'Jamal', to: 'Lazimpat', distanceKm: 2.0 },
      { from: 'Lazimpat', to: 'Maharajgunj', distanceKm: 3.0 },
      { from: 'Maharajgunj', to: 'Gongabu', distanceKm: 2.5 },
    ]
  },
  {
    routeNumber: 'S2',
    name: 'Kalanki - Airport',
    busType: 'bus',
    stops: ['Kalanki', 'Kalimati', 'Tripureshwor', 'Ratnapark', 'Baneshwor', 'Tinkune', 'Sinamangal', 'Airport'],
    edges: [
      { from: 'Kalanki', to: 'Kalimati', distanceKm: 2.0 },
      { from: 'Kalimati', to: 'Tripureshwor', distanceKm: 3.0 },
      { from: 'Tripureshwor', to: 'Ratnapark', distanceKm: 2.0 },
      { from: 'Ratnapark', to: 'Baneshwor', distanceKm: 3.0 },
      { from: 'Baneshwor', to: 'Tinkune', distanceKm: 1.5 },
      { from: 'Tinkune', to: 'Sinamangal', distanceKm: 2.0 },
      { from: 'Sinamangal', to: 'Airport', distanceKm: 2.0 },
    ]
  },
  {
    routeNumber: 'S3',
    name: 'Kalanki - Lagankhel',
    busType: 'electric',
    stops: ['Kalanki', 'Balkhu', 'Lagankhel'],
    edges: [
      { from: 'Kalanki', to: 'Balkhu', distanceKm: 3.0 },
      { from: 'Balkhu', to: 'Lagankhel', distanceKm: 3.0 },
    ]
  },
  {
    routeNumber: 'S4',
    name: 'Ratnapark - Koteshwor',
    busType: 'micro',
    stops: ['Ratnapark', 'Baneshwor', 'Koteshwor'],
    edges: [
      { from: 'Ratnapark', to: 'Baneshwor', distanceKm: 3.0 },
      { from: 'Baneshwor', to: 'Koteshwor', distanceKm: 4.0 },
    ]
  },
  {
    routeNumber: 'S5',
    name: 'Lagankhel - Jawalakhel',
    busType: 'micro',
    stops: ['Lagankhel', 'Satdobato', 'Jawalakhel'],
    edges: [
      { from: 'Lagankhel', to: 'Satdobato', distanceKm: 1.5 },
      { from: 'Satdobato', to: 'Jawalakhel', distanceKm: 2.0 },
    ]
  },
  {
    routeNumber: 'S6',
    name: 'Gongabu - Ratnapark',
    busType: 'micro',
    stops: ['Gongabu', 'Samakhusi', 'Jamal', 'Ratnapark'],
    edges: [
      { from: 'Gongabu', to: 'Samakhusi', distanceKm: 2.0 },
      { from: 'Samakhusi', to: 'Jamal', distanceKm: 3.0 },
      { from: 'Jamal', to: 'Ratnapark', distanceKm: 1.0 },
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  await Stop.deleteMany();
  await Route.deleteMany();
  await User.deleteMany();

  await Stop.insertMany(stops);
  console.log(`✓ ${stops.length} stops inserted`);

  await Route.insertMany(routes);
  console.log(`✓ ${routes.length} routes inserted`);

  const adminUser = new User({
    name: 'Admin',
    email: 'admin@busroute.com',
    password: 'admin123',
    isAdmin: true
  });

  await adminUser.save();
  console.log('✓ Admin user created');

  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});