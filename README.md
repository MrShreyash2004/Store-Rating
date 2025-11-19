# Store Ratings Platform

Tech stack:
- Backend: Express.js + MySQL
- Frontend: React (Vite)

This repository contains a scaffold for a store-rating web application with role-based access (System Administrator, Normal User, Store Owner). The scaffold includes a working Express backend with models and basic auth, and a React frontend skeleton.

Quick start (local development)

If Docker isn't available, you can run the backend and frontend locally.

1. Start the backend:

```cmd
cd backend
copy .env
# Edit backend\.env to set DB_HOST, DB_USER, DB_PASS, JWT_SECRET replace with ours
npm install
npm run dev
```

2. Seed the database (if needed ):

```cmd
cd backend
npm run seed
```

3. Start the frontend (separate terminal):

```cmd
cd frontend
npm install
set VITE_API_BASE=http://localhost:4000
npm run dev
```

4. Open the frontend in your browser: http://localhost:5173




