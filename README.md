# GED Multi-Tenant Application

Full-stack multi-tenant electronic document management system built in `stacKS` with NestJS, React, Prisma, PostgreSQL, and MinIO.

## Stack

- Backend: NestJS + TypeScript
- Frontend: React 18 + Vite + Tailwind CSS + Zustand
- Database: PostgreSQL + Prisma ORM
- Object storage: MinIO via S3-compatible SDK
- Auth: JWT access token + refresh token cookie
- Monorepo: npm workspaces with `apps/api` and `apps/web`

## Project layout

```text
stacKS/
├── docker-compose.yml
├── package.json
├── .env.example
├── apps/
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── prisma/
│   │   └── src/
│   └── web/
│       ├── Dockerfile
│       └── src/
```

## Features

- Multi-tenant isolation enforced with tenant-aware routes and guards
- Super-admin tenant management with automatic MinIO bucket creation
- Tenant user management with `ADMIN`, `EDITOR`, and `VIEWER` roles
- Folder hierarchy management
- Document upload, listing, download URL generation, soft delete, and versioning
- Share link creation with expiry, optional password, and download limits
- Public share page in the frontend for link access and download
- Audit log retrieval with filters
- Seed data for demo tenants and users

## Environment

Copy `.env.example` to `.env` if you want local overrides.

The API workspace scripts load the root `.env` automatically, so `npm run prisma:migrate --workspace @ged/api -- --name init` works without exporting `DATABASE_URL` manually.

```env
DATABASE_URL=postgresql://ged:gedpassword@localhost:5433/ged
PORT=3001
WEB_URL=http://localhost:5174
VITE_API_URL=http://localhost:3001/api
MINIO_ENDPOINT=localhost
MINIO_PORT=9002
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PRESIGNED_DOWNLOAD_TTL=3600
PRESIGNED_UPLOAD_TTL=900
```

## Local setup

1. Start infrastructure:

```bash
docker-compose up -d postgres minio
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Create the database schema:

```bash
npm run prisma:migrate --workspace @ged/api -- --name init
```

5. Seed demo data:

```bash
npm run seed
```

6. Start both applications in development mode:

```bash
npm run dev
```

Frontend: `http://localhost:5174`

API: `http://localhost:3001/api`

MinIO console: `http://localhost:9003`

PostgreSQL: `localhost:5433`

## Docker compose with app services

To run the app services through compose as well:

```bash
docker-compose up --build
```

Set `VITE_API_URL` in the root `.env` before building the web image for non-local deployments. Example: `VITE_API_URL=https://your-server.example.com/api`.

This starts:

- PostgreSQL on `5433`
- MinIO API on `9002`
- MinIO console on `9003`
- API on `3001`
- Web preview on `5174`

## Seeded accounts

- Super admin: `admin@ged.local` / `admin123`
- Acme admin: `alice@acme.local` / `password123`
- Acme editor: `edward@acme.local` / `password123`
- Globex admin: `gina@globex.local` / `password123`
- Globex viewer: `victor@globex.local` / `password123`

## Main API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Tenants

- `POST /api/tenants`
- `GET /api/tenants`
- `PATCH /api/tenants/:id`
- `DELETE /api/tenants/:id`

### Users

- `GET /api/tenants/:tenantId/users`
- `POST /api/tenants/:tenantId/users`
- `PATCH /api/tenants/:tenantId/users/:userId`
- `DELETE /api/tenants/:tenantId/users/:userId`

### Folders

- `GET /api/tenants/:tenantId/folders`
- `POST /api/tenants/:tenantId/folders`
- `PATCH /api/tenants/:tenantId/folders/:id`
- `DELETE /api/tenants/:tenantId/folders/:id`

### Documents

- `GET /api/tenants/:tenantId/documents`
- `POST /api/tenants/:tenantId/documents/upload`
- `GET /api/tenants/:tenantId/documents/:id`
- `GET /api/tenants/:tenantId/documents/:id/download`
- `DELETE /api/tenants/:tenantId/documents/:id`
- `GET /api/tenants/:tenantId/documents/:id/versions`
- `POST /api/tenants/:tenantId/documents/:id/upload`

### Shares

- `POST /api/tenants/:tenantId/documents/:id/share`
- `GET /api/tenants/:tenantId/shares`
- `DELETE /api/tenants/:tenantId/shares/:id`
- `GET /api/shares/:token`
- `POST /api/shares/:token/download`

### Audit

- `GET /api/tenants/:tenantId/audit`

## Notes

- All authenticated non-public routes require tenant access when a tenant is part of the path.
- The frontend expects the API on `http://localhost:3001/api` by default.
- The seed script also creates the sample MinIO buckets so uploads work immediately after seeding.