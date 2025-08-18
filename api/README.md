# brodbutik API (Azure Functions + Prisma)

This folder contains a serverless API for Azure Static Web Apps (SWA). It uses:
- Azure Functions (HTTP triggers) for endpoints under `/api/*`
- Prisma ORM for data access
- SQLite for local development, PostgreSQL in Azure

Structure:
- `/api/functions/*` – Functions endpoints (customers, orders)
- `/api/prisma/*` – Prisma schema and client
- `/api/.env` – Local environment variables (not committed)
- `/api/shared/*` – Shared utilities (Prisma client, response helpers)

Local dev quickstart:
1. Install deps
   npm install

2. Initialize Prisma (creates SQLite database file)
   npx prisma migrate dev --name init
   npx prisma generate
   (This will create prisma/dev.db and Prisma Client.)

3. Run Functions locally
   (Requires Azure Functions Core Tools)
   npm run dev

Endpoints (initial):
- GET /api/customers
- POST /api/customers
- GET /api/orders
- POST /api/orders

Environment:
- Local: .env uses DATABASE_URL="file:./dev.db"
- Azure: Configure DATABASE_URL (PostgreSQL) as an app setting for SWA backend functions

Deployment:
- SWA builds frontend and Functions together. Add staticwebapp.config.json at repo root to route /api to Functions. GitHub Actions will deploy both.
