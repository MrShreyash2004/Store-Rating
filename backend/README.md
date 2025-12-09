# Backend (Express )


Development (manual/local)

1. Copy the env template and edit values to match your local MySQL server:

```cmd
cd backend
copy .env
# edit backend\.env to set DB_HOST, DB_USER, DB_PASS, JWT_SECRET
```

2. Install dependencies and run in dev mode:

```cmd
npm install
npm run dev
```

The backend listens on port `4000` by default and will attempt to connect to the MySQL database configured in `.env`.


API endpoints (high level)

- POST /auth/signup — create normal user
- POST /auth/login — login (returns JWT)
- POST /auth/password — change password (authenticated)
- GET /stores — list stores (optional Authorization header to include user's rating)
- POST /ratings/:storeId — submit/update rating (user)
- Admin routes (require admin role): /admin/*
- Owner routes (require owner role): /owner/*
# Backend (Express)

Setup

1. In .env fill database credentials.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start server (dev):

```bash
npm run dev
```

The server will sync models to the database automatically (using sequelize.sync) and expose endpoints:
- GET / -> health
- POST /auth/signup
- POST /auth/login
- GET /stores

