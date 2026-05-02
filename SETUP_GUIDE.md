# 🚌 Bus Route Finder – Complete Setup Guide for VS Code

---

## STEP 1 — Install Required Software

### 1A. Install Node.js
1. Go to: https://nodejs.org
2. Download the **LTS version** (e.g. 20.x LTS)
3. Run the installer → click Next → Next → Install
4. Verify: open any terminal and type:
   ```
   node --version
   npm --version
   ```
   You should see version numbers. ✅

### 1B. Install MongoDB Community Server
1. Go to: https://www.mongodb.com/try/download/community
2. Select: Version = Latest, OS = Windows, Package = MSI
3. Download and run the installer
4. During install: choose "Complete" → check "Install MongoDB as a Service"
5. Also install **MongoDB Compass** when prompted (it's a GUI to see your data)
6. After install, MongoDB runs automatically in background ✅

### 1C. Install VS Code (if not already)
1. Go to: https://code.visualstudio.com
2. Download and install

### 1D. Install VS Code Extensions (recommended)
Open VS Code → Extensions (Ctrl+Shift+X) → search and install:
- **ESLint** – catches code errors
- **Prettier** – auto formats code
- **MongoDB for VS Code** – view your database inside VS Code
- **REST Client** – test your APIs without Postman

---

## STEP 2 — Set Up The Project

### 2A. Open the project folder in VS Code
1. Open VS Code
2. Go to **File → Open Folder**
3. Select your `bus-route-finder` folder
4. VS Code will show all your files in the Explorer on the left ✅

### 2B. Open the Terminal in VS Code
- Press **Ctrl + ` ** (backtick key, top-left of keyboard)
- OR go to **Terminal → New Terminal**
- You will see a terminal at the bottom of VS Code

### 2C. Install all Node packages
In the VS Code terminal, type:
```bash
npm install
```
Wait for it to finish. You will see a `node_modules` folder appear. ✅

---

## STEP 3 — Configure Environment Variables

Open the `.env` file in your project. It should look like this:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/busroutefinder
SESSION_SECRET=busroutefinder_secret_key_2024
```

- `PORT` = the port your server runs on (3000 is fine)
- `MONGO_URI` = your local MongoDB connection (don't change this)
- `SESSION_SECRET` = a secret key for login sessions (can be any string)

No changes needed if you installed MongoDB locally. ✅

---

## STEP 4 — Seed the Database

This will add all the bus stops, routes, and a test admin user to MongoDB.

In the VS Code terminal:
```bash
npm run seed
```

You should see:
```
Connected to MongoDB for seeding...
✓ 15 stops inserted
✓ 8 routes inserted
✓ Admin user created: admin@busroute.com / admin123
🎉 Database seeded successfully!
```

✅ Your database now has real data!

---

## STEP 5 — Start the Server

```bash
npm run dev
```

You will see:
```
Server running on http://localhost:3000
MongoDB Connected Successfully
```

Open your browser and go to: **http://localhost:3000** 🎉

---

## STEP 6 — Test the Application

### Test as Guest (no login required):
1. Go to http://localhost:3000
2. Click **Find Route**
3. Select **From**: Ratnapark, **To**: Koteshwor
4. Click **Find Route**
5. You should see the route result with distance, fare, and path ✅

### Test as Admin:
1. Go to http://localhost:3000/login
2. Email: `admin@busroute.com`
3. Password: `admin123`
4. You will be redirected to Admin Panel ✅

### Test as Regular User:
1. Go to http://localhost:3000/register
2. Fill in your details
3. Search a route and click **Save Route**
4. Check your Dashboard ✅

---

## STEP 7 — Project Folder Structure (reference)

```
bus-route-finder/
│
├── server.js              ← Main server file (start here)
├── seed.js                ← Run once to fill database with test data
├── .env                   ← Your configuration (port, DB URL)
├── package.json           ← Project info and dependencies
│
├── config/
│   └── db.js              ← MongoDB connection
│
├── models/                ← Database schemas (what data looks like)
│   ├── Stop.js            ← Bus stop model
│   ├── Route.js           ← Bus route model
│   └── User.js            ← User model (with password hashing)
│
├── algorithms/            ← THE 3 CORE ALGORITHMS
│   ├── dijkstra.js        ← Algorithm 1: Shortest path
│   ├── bfs.js             ← Algorithm 2: Transfer detection
│   └── fareCalculator.js  ← Algorithm 3: Fare calculation
│
├── controllers/           ← Business logic for each feature
│   ├── authController.js
│   ├── routeController.js
│   ├── adminController.js
│   └── userController.js
│
├── routes/                ← API URL definitions
│   ├── authRoutes.js
│   ├── routeRoutes.js
│   ├── adminRoutes.js
│   └── userRoutes.js
│
├── middleware/
│   └── auth.js            ← Login/admin check for protected pages
│
└── public/                ← Frontend (HTML, CSS, JS)
    ├── index.html
    ├── css/style.css
    ├── js/main.js
    └── pages/
        ├── search.html
        ├── login.html
        ├── register.html
        ├── dashboard.html
        ├── admin.html
        └── allroutes.html
```

---

## STEP 8 — API Endpoints Reference

| Method | URL | What it does | Auth? |
|--------|-----|--------------|-------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| POST | /api/auth/logout | Logout | No |
| GET | /api/auth/me | Get current user | No |
| POST | /api/routes/search | **Search route (runs all 3 algorithms)** | No |
| GET | /api/routes/stops | Get all stops | No |
| GET | /api/routes/all | Get all routes | No |
| GET | /api/routes/stop/:name | Get routes through a stop | No |
| GET | /api/user/history | Get my search history | Login |
| GET | /api/user/saved | Get saved routes | Login |
| POST | /api/user/save | Save a route | Login |
| DELETE | /api/user/saved/:index | Delete saved route | Login |
| POST | /api/admin/stop | Add a new stop | Admin |
| DELETE | /api/admin/stop/:id | Delete a stop | Admin |
| POST | /api/admin/route | Add a new route | Admin |
| PUT | /api/admin/route/:id | Update a route | Admin |
| DELETE | /api/admin/route/:id | Delete a route | Admin |

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'express'` | npm install not run | Run `npm install` |
| `MongooseServerSelectionError` | MongoDB not running | Start MongoDB service (Windows: search "Services" → MongoDB) |
| `Port 3000 already in use` | Another app on port 3000 | Change PORT in .env to 3001 |
| `Session not working` | connect-mongo missing | Run `npm install` again |
| White page / 404 | Wrong file path | Check public/ folder exists |

---

## Useful Commands

```bash
npm run dev      # Start server with auto-restart (use this during development)
npm start        # Start server without auto-restart
npm run seed     # Re-seed the database (WARNING: clears existing data)
```

To stop the server: press **Ctrl + C** in the terminal.
