# TitanOs Backend

Sports management platform REST API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**. Supports multi-role authentication, athlete tracking, medical records, wellness analysis with AI, file storage via MinIO, fan engagement, and full audit logging.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Security](#security)
- [File Storage](#file-storage)
- [AI Insights](#ai-insights)
- [Audit Logging](#audit-logging)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (ES Modules) |
| Framework | Express 4.18 |
| ORM | Prisma 5.7 |
| Database | PostgreSQL 16 |
| Auth | JWT (jsonwebtoken 9) + bcryptjs |
| Validation | Zod 3.22 |
| File Storage | MinIO (S3-compatible) |
| AI | OpenAI API (gpt-4o-mini) with rule-based fallback |
| Testing | Vitest 4 + Supertest |
| Documentation | Swagger UI (OpenAPI 3.0) |
| Security | Helmet + express-rate-limit + CORS |
| Containerization | Docker + Docker Compose |

---

## Architecture

The backend follows a strict **layered architecture** with dependency injection:

```
Request → Router → Middleware → Controller → Service → Repository → Prisma → DB
```

- **Router** — defines routes and applies middleware chains
- **Controller** — handles HTTP request/response, calls service
- **Service** — business logic, orchestrates repositories
- **Repository** — data access layer, all Prisma queries
- **Common** — shared utilities (errors, validation, JWT, response helpers)
- **Middlewares** — auth guard, roles guard, audit log, rate limiter, file upload

---

## Project Structure

```
Backend/
├── src/
│   ├── app.js                      # Express app (routes, middleware, security)
│   ├── server.js                   # Server startup
│   ├── common/
│   │   ├── asyncWrapper.js         # Async error propagation helper
│   │   ├── errors.js               # Custom error classes
│   │   ├── jwt.js                  # JWT sign/verify helpers
│   │   ├── response.js             # Standard response formatters
│   │   ├── roles.js                # Role constants
│   │   └── validate.js             # Zod validation wrapper
│   ├── config/
│   │   ├── db.js                   # Prisma client singleton
│   │   ├── minio.js                # MinIO client + bucket setup
│   │   └── swagger.js              # OpenAPI 3.0 spec
│   ├── controllers/                # HTTP handlers (one per module)
│   ├── services/                   # Business logic (one per module)
│   ├── repositories/               # Data access (one per module)
│   ├── routers/                    # Route definitions (one per module)
│   ├── schemas/                    # Zod input validation schemas
│   ├── middlewares/
│   │   ├── authGuard.js            # JWT token verification
│   │   ├── rolesGuard.js           # Role-based access factory
│   │   ├── auditLog.js             # Action audit middleware
│   │   ├── rateLimiter.js          # API + auth rate limiters
│   │   ├── upload.js               # Multer file upload config
│   │   └── globalHandlers.js       # 404 + centralized error handler
│   └── tests/
│       ├── unit/                   # Unit tests
│       └── integration/            # Integration tests
├── prisma/
│   ├── schema.prisma               # Database schema + enums + relations
│   └── seed.js                     # Database seed script
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Database Schema

### Enums

| Enum | Values |
|---|---|
| `Role` | `ADMIN`, `STAFF`, `PLAYER`, `FAN` |
| `MemberType` | `PLAYER`, `COACH`, `STAFF` |
| `SessionType` | `TRAINING`, `MATCH`, `MEETING` |
| `MatchStatus` | `SCHEDULED`, `LIVE`, `FINISHED`, `CANCELLED` |
| `MatchEventType` | `GOAL`, `YELLOW_CARD`, `RED_CARD`, `SUBSTITUTION`, `INJURY` |
| `FanActionType` | `VOTE`, `TICKET_PURCHASE`, `LIKE`, `SHARE` |
| `ArticleStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `RiskLevel` | `LOW`, `MEDIUM`, `HIGH` |
| `MediaType` | `IMAGE`, `VIDEO`, `DOCUMENT`, `TACTICAL` |
| `MediaAccess` | `PUBLIC`, `PRIVATE`, `TEAM` |
| `TacticalContentType` | `FORMATION`, `PLAY`, `ANALYSIS`, `HIGHLIGHT` |

### Models

#### User
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| email | String | Unique |
| passwordHash | String | bcrypt cost 12 |
| refreshToken | String? | Hashed, nullable |
| role | Role | Default: `PLAYER` |
| createdAt, updatedAt | DateTime | Auto-managed |

#### Member
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | Unique FK → User |
| firstName, lastName | String | |
| position | String? | |
| jerseyNumber | Int? | |
| type | MemberType | |
| teamId | String? | FK → Team |

#### Team
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| name | String | Unique |
| sport | String | |
| logoUrl | String? | |

#### Session
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| title | String | |
| type | SessionType | |
| date | DateTime | |
| duration | Int | Minutes |
| location | String? | |
| teamId | String | FK → Team |

#### Match
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| homeTeamId, awayTeamId | String | FK → Team |
| homeScore, awayScore | Int | Default 0 |
| status | MatchStatus | Default: `SCHEDULED` |
| scheduledAt | DateTime | |
| venue | String? | |

#### MatchEvent
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| matchId | String | FK → Match |
| memberId | String? | FK → Member |
| type | MatchEventType | |
| minute | Int | |
| detail | String? | |

#### MedicalRecord
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| memberId | String | FK → Member |
| diagnosis | String | |
| treatment | String? | |
| notes | String? | |
| fileUrls | String[] | Array of file URLs |
| recordedAt | DateTime | |
| createdBy | String | User ID |

#### WellnessForm
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| memberId | String | FK → Member |
| fatigue | Int | 1–10 scale |
| sleep | Int | 1–10 scale |
| stress | Int | 1–10 scale |
| mood | Int | 1–10 scale |
| notes | String? | |
| date | DateTime | |

#### AIInsight
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| memberId | String | FK → Member |
| riskLevel | RiskLevel | `LOW`, `MEDIUM`, `HIGH` |
| summary | String | AI-generated summary |
| recommendation | String | AI-generated advice |
| dataWindow | Int | Days of data analysed |
| generatedAt | DateTime | |

#### Performance
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| memberId | String | FK → Member |
| sessionId | String? | FK → Session |
| distance | Float? | Kilometres |
| speed | Float? | km/h |
| rating | Int? | 1–10 |
| notes | String? | |
| recordedAt | DateTime | |

#### Media
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| filename | String | |
| fileUrl | String | |
| bucketName | String | |
| objectKey | String | Unique, MinIO key |
| mimeType | String | |
| size | Int | Bytes |
| type | MediaType | |
| access | MediaAccess | |
| ownerId | String | FK → User |
| teamId | String? | FK → Team |

#### AuditLog
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | FK → User |
| action | String | e.g. `LOGIN`, `CREATE` |
| resource | String | e.g. `auth`, `medical` |
| resourceId | String? | |
| ipAddress | String? | |
| createdAt | DateTime | |

#### Article
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| title | String | |
| content | String | |
| coverImage | String? | |
| status | ArticleStatus | Default: `DRAFT` |
| authorId | String | FK → User |
| publishedAt | DateTime? | |

#### FanAction
| Field | Type | Notes |
|---|---|---|
| id | String (UUID) | Primary key |
| userId | String | FK → User |
| matchId | String? | FK → Match |
| type | FanActionType | |
| payload | JSON | Action data |

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login, returns `accessToken` + sets HttpOnly `refreshToken` cookie |
| POST | `/refresh` | Public | Rotate refresh token, returns new `accessToken` |
| POST | `/logout` | Bearer | Invalidate refresh token |

### Sport — `/api/sport`

**All routes require Bearer token.**

#### Teams
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/teams` | All | List all teams |
| GET | `/teams/:id` | All | Get team by ID |
| POST | `/teams` | ADMIN, STAFF | Create team |
| PUT | `/teams/:id` | ADMIN, STAFF | Update team |
| DELETE | `/teams/:id` | ADMIN | Delete team |

#### Members
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/members` | All | List all members |
| GET | `/members/:id` | All | Get member by ID |
| POST | `/members` | ADMIN, STAFF | Create member |
| PUT | `/members/:id` | ADMIN, STAFF | Update member |
| DELETE | `/members/:id` | ADMIN | Delete member |
| PATCH | `/members/:id/team` | ADMIN, STAFF | Link member to team |
| DELETE | `/members/:id/team` | ADMIN, STAFF | Unlink member from team |

#### Sessions
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/sessions` | All | List all sessions |
| GET | `/sessions/:id` | All | Get session by ID |
| POST | `/sessions` | ADMIN, STAFF | Create session |
| PUT | `/sessions/:id` | ADMIN, STAFF | Update session |
| DELETE | `/sessions/:id` | ADMIN | Delete session |
| POST | `/sessions/:id/participants` | ADMIN, STAFF | Add participant |
| DELETE | `/sessions/:id/participants/:memberId` | ADMIN, STAFF | Remove participant |
| GET | `/sessions/:id/performances` | All | Get session performances |

#### Performance
| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/members/:memberId/stats` | All | Player statistics summary |
| GET | `/members/:memberId/performances` | All | Member performance history |
| GET | `/performances/:id` | All | Get performance by ID |
| POST | `/performances` | ADMIN, STAFF | Create performance record |
| PUT | `/performances/:id` | ADMIN, STAFF | Update performance |
| DELETE | `/performances/:id` | ADMIN | Delete performance |

### Medical — `/api/medical`

**All routes require Bearer token + role `ADMIN` or `STAFF`.**

| Method | Path | Description |
|---|---|---|
| GET | `/records` | List all medical records |
| GET | `/records/:id` | Get record by ID |
| GET | `/records/:id/signed-url` | Generate signed URL for attached file |
| POST | `/records` | Create medical record |
| POST | `/records/:id/files` | Attach file reference to record |
| PUT | `/records/:id` | Update record |
| DELETE | `/records/:id` | Delete record |

### Wellness — `/api/wellness`

**All routes require Bearer token.**

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/forms` | ADMIN, STAFF | List all wellness forms |
| GET | `/forms/:id` | ADMIN, STAFF | Get form by ID |
| GET | `/members/:memberId/recent` | ADMIN, STAFF | Get recent forms for member |
| POST | `/forms` | ADMIN, STAFF, PLAYER | Submit wellness form |
| PUT | `/forms/:id` | ADMIN, STAFF | Update form |
| DELETE | `/forms/:id` | ADMIN | Delete form |

### Media — `/api/media`

**All routes require Bearer token.**

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/upload` | ADMIN, STAFF, PLAYER | Upload file (multipart/form-data) |
| GET | `/` | All | List accessible media |
| GET | `/team/:teamId` | ADMIN, STAFF | Get media by team |
| GET | `/:id` | All | Get media metadata |
| GET | `/:id/presigned-url` | All | Generate presigned URL (15 min default, max 60 min) |
| DELETE | `/:id` | Owner or ADMIN | Delete media |

**Upload fields:** `file` (binary), `type` (IMAGE/VIDEO/DOCUMENT/TACTICAL), `access` (PUBLIC/PRIVATE/TEAM), `teamId` (optional)

### Fan — `/api/fan`

**All routes require Bearer token.**

#### Matches
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/matches` | ADMIN, STAFF | Create match |
| GET | `/matches` | All | List all matches |
| GET | `/matches/:id` | All | Get match with events |
| PATCH | `/matches/:id` | ADMIN, STAFF | Update match score/status |
| DELETE | `/matches/:id` | ADMIN | Delete match |

#### Match Events
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/events` | ADMIN, STAFF | Add match event (goal, card, etc.) |
| GET | `/matches/:matchId/events` | All | Get match event timeline |
| DELETE | `/events/:id` | ADMIN, STAFF | Delete match event |

#### Fan Actions
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/actions` | All | Submit fan action (vote/like/share/ticket) |
| GET | `/actions/me` | All | Get own fan actions |
| GET | `/matches/:matchId/actions` | ADMIN, STAFF | Get all actions for match |
| GET | `/matches/:matchId/votes` | All | Get match vote counts |

#### Articles
| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/articles` | ADMIN, STAFF | Create article |
| GET | `/articles` | All | List published articles |
| GET | `/articles/:id` | All | Get article by ID |
| PATCH | `/articles/:id` | ADMIN, STAFF | Update article |
| DELETE | `/articles/:id` | ADMIN | Delete article |

### AI Insights — `/api/ai`

**All routes require Bearer token + role `ADMIN` or `STAFF`.**

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/analyze` | ADMIN, STAFF | Trigger wellness analysis for a member |
| GET | `/members/:memberId/insights` | ADMIN, STAFF | List all insights for member |
| GET | `/members/:memberId/insights/latest` | ADMIN, STAFF | Latest insight for member |
| GET | `/insights/:id` | ADMIN, STAFF | Get insight by ID |
| DELETE | `/insights/:id` | ADMIN | Delete insight |

**Analyze request body:**
```json
{
  "memberId": "uuid",
  "dataWindow": 14
}
```

### Audit — `/api/audit`

**All routes require Bearer token + role `ADMIN`.**

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all audit logs |
| GET | `/users/:userId` | Get audit logs for a specific user |

### System

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Health check (status, uptime, timestamp) |
| GET | `/api/docs` | Public (dev only) | Swagger UI |

---

## Authentication & Authorization

### Token Strategy

```
POST /api/auth/login
  → returns { accessToken } in response body
  → sets refreshToken as HttpOnly cookie
```

- **Access Token** — short-lived (15 min), sent as `Authorization: Bearer <token>` header
- **Refresh Token** — long-lived (7 days), stored as HttpOnly cookie, hashed in DB

### Token Rotation

```
POST /api/auth/refresh
  → reads refreshToken from cookie
  → verifies token hash against DB
  → issues new accessToken + new refreshToken (rotation)
```

### Roles

| Role | Description |
|---|---|
| `ADMIN` | Full access to all resources |
| `STAFF` | Read/write access; cannot delete or access audit logs |
| `PLAYER` | Can submit wellness forms, upload media, view own data |
| `FAN` | Can view public data, submit fan actions |

### Guards

```js
// Apply in route definition:
router.get('/records', authGuard, rolesGuard('ADMIN', 'STAFF'), controller.getAll);
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/titanos_db
DIRECT_URL=postgresql://user:password@localhost:5432/titanos_db

# CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:3000

# JWT — generate with: node -e "require('crypto').randomBytes(64).toString('hex')"
JWT_ACCESS_SECRET=your_jwt_access_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# MinIO (File Storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=titanos
MINIO_PUBLIC_URL=http://localhost:9000

# OpenAI (optional — falls back to rule-based scoring if not set)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

# File Upload
MAX_FILE_SIZE=52428800
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16
- MinIO (or any S3-compatible service)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

The server starts on `http://localhost:3001`.

### Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with hot reload (nodemon) |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Create and apply migration (dev) |
| `npm run db:migrate:prod` | Apply migrations (production) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed the database |
| `npm run db:reset` | Reset and re-seed database |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

---

## Docker Setup

### Development with Docker Compose

```bash
# Start all services (API + PostgreSQL + MinIO)
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

### Services

| Service | Port | Description |
|---|---|---|
| `api` | 3001 | TitanOs backend |
| `postgres` | 5432 | PostgreSQL database |
| `minio` | 9000 | MinIO S3 storage |
| `minio` (console) | 9001 | MinIO web console |

### Production Build

```bash
# Build image
docker build -t titanos-backend .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=... \
  -e JWT_ACCESS_SECRET=... \
  -e JWT_REFRESH_SECRET=... \
  titanos-backend
```

The Dockerfile uses `node:20-alpine` for a minimal production image. Dependencies are installed with `npm ci --omit=dev` and the Prisma client is generated at build time.

---

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report (outputs to ./coverage)
npm run test:coverage
```

### Test Structure

```
src/tests/
├── unit/
│   ├── auth.schemas.test.js       # Zod schema validation
│   ├── computeRiskLevel.test.js   # Risk level scoring logic
│   ├── errors.test.js             # Custom error classes
│   └── validate.test.js           # Validation wrapper
└── integration/
    ├── auth.routes.test.js        # Auth endpoints (register, login, refresh, logout)
    ├── medical.access.test.js     # Medical role-based access control
    └── roles.test.js              # Role guard enforcement
```

Integration tests mock the Prisma client via `vi.mock()` and use `supertest` to make HTTP requests against the Express app.

---

## API Documentation

Swagger UI is available in development mode at:

```
http://localhost:3001/api/docs
```

The spec is defined in [src/config/swagger.js](src/config/swagger.js) using OpenAPI 3.0. All endpoints are documented with request/response schemas and role requirements.

---

## Security

| Feature | Implementation |
|---|---|
| Security headers | `helmet` (14 headers: CSP, HSTS, X-Frame-Options, etc.) |
| Rate limiting | `express-rate-limit` — 100 req/15min global, 10 req/15min for auth |
| CORS | Configurable origin allowlist with credentials support |
| Password hashing | `bcryptjs` with cost factor 12 |
| Refresh token hashing | `bcryptjs` with cost factor 10 |
| JWT | Short-lived access tokens (15m) + HttpOnly refresh cookie (7d) |
| Input validation | Zod schemas on all endpoints |
| Role-based access | `rolesGuard` middleware on all sensitive routes |
| x-powered-by | Disabled |
| SQL injection | Prevented by Prisma parameterized queries |

### Error Response Format

All errors return a consistent JSON structure:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

| HTTP Status | Error |
|---|---|
| 400 | Validation error, bad request |
| 401 | Missing or invalid token |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## File Storage

Files are stored in MinIO (S3-compatible).

### Upload Flow

```
Client → POST /api/media/upload (multipart/form-data)
  → Multer parses file into memory (max 50 MB)
  → Validate MIME type (allowlist)
  → Ensure bucket exists
  → Upload to MinIO (UUID-based object key)
  → Save metadata to DB (Media record)
  → Return media metadata + fileUrl
```

### Supported File Types

| Category | MIME Types |
|---|---|
| Images | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| Videos | `video/mp4`, `video/quicktime`, `video/x-msvideo` |
| Documents | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

### Presigned URLs

```
GET /api/media/:id/presigned-url?expirySeconds=900
```

- Default expiry: 900 seconds (15 minutes)
- Maximum expiry: 3600 seconds (1 hour)
- Access control: ADMIN/STAFF can access any file; PRIVATE files require ownership; TEAM files require team membership

---

## AI Insights

The AI module analyses wellness form data and generates risk assessments.

### Analysis Flow

```
POST /api/ai/analyze { memberId, dataWindow }
  → Fetch recent wellness forms (last N days)
  → Aggregate: avgFatigue, avgSleep, avgStress, avgMood
  → If OPENAI_API_KEY is set → call OpenAI GPT-4o-mini
  → Else → rule-based scoring (threshold checks)
  → Store AIInsight with riskLevel + summary + recommendation
```

### Risk Level Logic (Rule-Based Fallback)

| Condition | Risk Level |
|---|---|
| avgFatigue ≥ 7 OR avgStress ≥ 7 OR avgSleep ≤ 4 OR avgMood ≤ 4 | `HIGH` |
| avgFatigue ≥ 5 OR avgStress ≥ 5 OR avgSleep ≤ 6 OR avgMood ≤ 6 | `MEDIUM` |
| All metrics within healthy range | `LOW` |

### OpenAI Integration

When `OPENAI_API_KEY` is set, the service sends aggregated wellness metrics to GPT-4o-mini and requests a structured JSON response with `riskLevel`, `summary`, and `recommendation`. Falls back to rule-based on API error.

---

## Audit Logging

All sensitive write operations are automatically logged via the `auditAction` middleware.

```js
// Example usage in route:
router.post('/login', auditAction('LOGIN', 'auth'), authController.login);
```

Logs are written **asynchronously after the response** (non-blocking). Only successful operations (2xx) by authenticated users are logged.

### Audit Log Fields

| Field | Description |
|---|---|
| userId | The user who performed the action |
| action | Action name (e.g., `LOGIN`, `CREATE`, `DELETE`) |
| resource | Resource type (e.g., `auth`, `medical`, `media`) |
| resourceId | ID of the affected resource (if applicable) |
| ipAddress | Client IP address |
| createdAt | Timestamp |

Audit logs are accessible at `GET /api/audit` (ADMIN only).
