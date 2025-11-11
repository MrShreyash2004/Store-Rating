# Backend (Express + Sequelize)


Development (manual/local)

1. Copy the env template and edit values to match your local MySQL server:

```cmd
cd backend
copy .env.example .env
# edit backend\.env to set DB_HOST, DB_USER, DB_PASS, JWT_SECRET
```

2. Install dependencies and run in dev mode:

```cmd
npm install
npm run dev
```

The backend listens on port `4000` by default and will attempt to connect to the MySQL database configured in `.env`.

Seeding sample data

After the backend is running and the database is ready, run:

```cmd
npm run seed
```

This will create demo users and stores, including:
- admin@storely.test / Admin@1234
- owner@storely.test / Owner@1234
- user@storely.test / User@1234

API endpoints (high level)

- POST /auth/signup — create normal user
- POST /auth/login — login (returns JWT)
- POST /auth/password — change password (authenticated)
- GET /stores — list stores (optional Authorization header to include user's rating)
- POST /ratings/:storeId — submit/update rating (user)
- Admin routes (require admin role): /admin/*
- Owner routes (require owner role): /owner/*
# Backend (Express + Sequelize)

Setup

1. Copy `.env.example` to `.env` and fill database credentials.
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

