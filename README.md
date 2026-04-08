
# TitanOs Backend

Modern sports management REST API built with **Node.js**, **Express**, **Mongoose** (MongoDB), and **Zod**. All endpoints are under `/api` and follow a strict layered architecture for maintainability and scalability.

---

## Architecture

```bash
Request → Router → Middleware → Controller → Service → Repository → Model/Utils → MongoDB/MinIO
```

- **Router**: Express routers per domain, static `build()`
- **Controller**: Handles HTTP, parses/validates input, calls service
- **Service**: Business logic, calls repository
- **Repository**: Mongoose queries or direct MinIO ops (for storage)
- **Model**: Mongoose schemas (see below)
- **Schema**: Zod input validation per domain
- **Utils**: Shared helpers (MinioUtils, bcrypt, etc.)

---

## Project Structure

```bash
titanos-api/
├── src/
│   ├── app.js                 # Express app: /api, security, Swagger
│   ├── server.js              # Listen + MongoDB connect
│   ├── common/                # errors.js, response.js
│   ├── config/                # config.js, db.js, swagger.js
│   ├── controllers/           # One per domain (including storage)
│   ├── services/              # One per domain (including storage)
│   ├── repositories/          # One per domain (including storage)
│   ├── schemas/               # Zod schemas
│   ├── models/                # Mongoose models
│   ├── middlewares/           # auth, roles, rate-limit, upload, error-handler
│   ├── routes/                # *Routes.build() per domain
│   └── utils/                 # MinioUtils, bcrypt, etc.
├── seed/
│   └── seed.js                # Demo data
├── Dockerfile
├── docker-compose.yml         # api + mongo + minio
├── .env.example
└── package.json
```

---

## Example: Match Model (2026)

```js
{
  _id: ObjectId,
  team: ObjectId, // ref: Team, required
  matchDate: Date, // required
  matchTime: String,
  matchCity: String, // required
  matchCountry: String, // default: "morocco"
  matchStadium: String, // required
  matchOpponent: String, // required
  matchCompetition: String, // enum: ["League", "Cup", "Friendly"], default: "League"
  matchScore: Number, // default: 0
  matchLocation: String, // enum: ["HOME", "AWAY", "NEUTRAL"], default: "HOME"
  matchSaison: String,
  matchAttendance: Number, // default: 0
  status: String, // enum: ["SCHEDULED", "LIVE", "FINISHED", "CANCELLED", "POSTPONED"], default: "SCHEDULED"
  createdAt: Date,
  updatedAt: Date
}
```

> See all domain models in `src/models/` for full details.

---

## File Storage (MinIO)

All file storage now follows the same layered pattern:

```bash
Request → Router → Middleware → StorageController → StorageService → StorageRepository → MinioUtils → MinIO
```

### Upload Flow

1. Client POSTs `/api/media/upload` (multipart/form-data)
2. Multer parses file into memory (max 50 MB)
3. Controller delegates to StorageService
4. StorageService validates, builds object name, calls StorageRepository
5. StorageRepository uploads to MinIO (via MinioUtils)
6. Media metadata saved to DB
7. Returns media metadata + fileUrl

### Supported File Types

- **Images:**
  - image/jpeg
  - image/png
  - image/gif
  - image/webp
- **Videos:**
  - video/mp4
  - video/quicktime
  - video/x-msvideo
- **Documents:**
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document

---

## Authentication & Authorization

### Token Strategy

```text
POST /api/auth/login
  → returns { accessToken } in response body
  → sets refreshToken as HttpOnly cookie (path `/api/auth`)
```

- **Access Token** — short-lived (15 min), sent as `Authorization: Bearer <token>` header
- **Refresh Token** — long-lived (7 days), stored as HttpOnly cookie, hashed in DB

### Token Rotation

```text
POST /api/auth/refresh
  → reads refreshToken from cookie
  → verifies token hash against DB
  → issues new accessToken + new refreshToken (rotation)
```

### Roles

- **ADMIN**: Full access to all resources
- **STAFF**: Read/write access; cannot delete certain resources (per route)
- **PLAYER**: Can submit wellness forms, upload media, view own data
- **FAN**: Can view public data, submit fan actions
- **USER**: Default for new users (see model)

### Guards

```js
// Route modules use auth guard + role allowlist, e.g.:
r.get("/records", auth, roles.allow("ADMIN", "STAFF"), controller.getAllRecords);
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

See **.env.example** for the full list. Typical variables:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/your_db
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=titanos
MINIO_PUBLIC_URL=http://localhost:9000
MEDIA_OBJECT_KEY_SECRET=at_least_32_chars_random_secret
MAX_FILE_SIZE=52428800
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local or remote URI)
- MinIO optional for local file upload tests (or use Docker Compose)

### Installation

```bash
git clone <repo-url>
cd titanos-api
npm install
cp .env.example .env
# Set MONGODB_URI, JWT secrets, MinIO, MEDIA_OBJECT_KEY_SECRET, etc.

npm run db:seed   # optional: demo users/data (see seed/seed.js)
npm run dev       # or: npm start
```

The server listens on **`PORT`** from `.env` (default **3001**).

### Available Scripts

- `npm start`: Production server (`node --watch`)
- `npm run dev`: Dev server with nodemon
- `npm run db:seed`: Run MongoDB seed script
- `npm run lint`: ESLint (zero warnings)

---

## Docker Setup

### Development with Docker Compose

```bash
# Start API + MongoDB + MinIO
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

### Docker Services

- **api**: 3001 — TitanOs backend
- **mongo**: 27017 — MongoDB (internal; expose if needed)
- **minio**: 9000 — MinIO S3 storage
- **minio (console)**: 9001 — MinIO web console

### Production Build

```bash
# Build image
docker build -t titanos-backend .

# Run container
docker run -p 3001:3001 \
  -e MONGODB_URI=... \
  -e JWT_ACCESS_SECRET=... \
  -e JWT_REFRESH_SECRET=... \
  -e MINIO_ENDPOINT=... \
  titanos-backend
```

The **Dockerfile** uses `node:20-alpine`, runs `npm ci`, copies `src` and `seed`, and starts `node src/server.js`.

---

## API Documentation

Swagger UI is available when **`NODE_ENV` is not `production`** at:

  <http://localhost:3001/api/docs>

The OpenAPI 3.0 spec lives in `src/config/swagger.js` and is auto-aligned with backend routes and models. Auth endpoints and examples match the seed data. Update the spec as you add or change endpoints.

---

## Observability & Operations

- **Logging**: MongoDB connect logs a short message to the console. No request logger in-repo.

---

## Security

- **Security headers**: `helmet` (CSP, HSTS, X-Frame-Options, etc.)
- **Rate limiting**: `express-rate-limit` — 100 req/15min global, 10 req/15min for auth; JSON body includes `error.code`
- **CORS**: Configurable origin (`Config.corsOrigin`); allows `Authorization`, `Content-Type`
- **Password hashing**: `bcryptjs` with cost factor 12
- **Refresh token hashing**: `bcryptjs` with cost factor 10
- **JWT**: Short-lived access tokens (15m) + HttpOnly refresh cookie (7d)
- **Input validation**: Zod in controllers (`src/schemas`); failures use `ValidationError.fromZod`
- **Role-based access**: `roles-guard` where routes require roles
- **x-powered-by**: Disabled
- **NoSQL injection**: `express-mongo-sanitize` on JSON bodies

### Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Human-readable summary",
  "error": {
    "code": "VALIDATION_ERROR",
    "issues": [{ "path": "email", "message": "…" }]
  }
}
```

`issues` is present only for Zod validation failures (`ValidationError.fromZod`). Other errors typically have only `error.code` and `message`.

**HTTP Status Codes:**

- 400: Validation error, bad request
- 401: Missing or invalid token
- 403: Insufficient role
- 404: Resource not found
- 409: Conflict (duplicate)
- 429: Rate limit exceeded
- 500: Internal server error

---
