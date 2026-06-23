# MARS - Meeting Area Reservation System

A web application for managing meeting rooms and reservations. Built with [SolidStart](https://docs.solidjs.com/solid-start/) and [SolidJS](https://docs.solidjs.com/).

## Tech Stack

- **Framework**: SolidStart 2.0 (SolidJS)
- **Database**: MySQL (via Prisma ORM)
- **Styling**: Tailwind CSS + Shadcn UI
- **Package Manager**: pnpm
- **Deployment**: Docker

## Prerequisites

- Node.js >= 24
- pnpm >= 11.8
- MySQL server

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/GAM-Retail/mars.git
cd mars

# Install dependencies
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your local database credentials:

```
DATABASE_URL=mysql://your_user:your_password@localhost:3306/your_database
SHADOW_DATABASE_URL=mysql://your_user:your_password@localhost:3306/your_database_shadow
SESSION_SECRET=your_session_secret_key
INITIAL_USER_PASSWORD=your_initial_password
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Setup

Run migrations and generate Prisma client:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Building for Production

### Local Build

```bash
pnpm build
```

The build output will be in `.output/` directory. To run the production build:

```bash
node .output/server/index.mjs
```

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose
- External MySQL server (or local MySQL accessible to container)

### 1. Configure Environment

Update your `.env` file with production database credentials:

```
DATABASE_URL=mysql://user:password@your_mysql_host:3306/database
SHADOW_DATABASE_URL=mysql://user:password@your_mysql_host:3306/database_shadow
SESSION_SECRET=your_production_secret
NODE_ENV=production
PORT=3000
```

### 2. Build and Run

```bash
# Build and start all services (migrator, seeder, app)
docker compose --env-file .env up --build -d

# View app logs
docker logs mars-app

# View migrator logs (runs once on first deploy)
docker logs mars-db-migrator

# Stop all services
docker compose --env-file .env down
```

The app will be available at `http://localhost:3000` (or the PORT you configured).

### Docker Services

The docker-compose.yml includes:

- **migrator**: Runs `prisma migrate deploy` on startup (once per deployment)
- **seeder**: Runs `prisma db seed` (optional - for initial data)
- **app**: The main application container

### Docker Notes

- On Windows/Mac, use `host.docker.internal` to connect to host MySQL
- On Linux, use the host's IP address instead of localhost

Example for local MySQL on Windows/Mac:

```
DATABASE_URL=mysql://mars_user:password@host.docker.internal:3306/mars_db
```

## CI/CD (GitHub Actions)

The project includes GitHub Actions workflows that deploy via Docker's native SSH transport. Code is checked out on the runner and sent to the remote Docker daemon — no source code stored on the server.

### Development Deployment (`deploy-dev.yml`)

- **Trigger**: Push to `master` branch
- **Concurrency**: Stale runs are cancelled automatically
- **Flow**:
  1. Checkout code (`actions/checkout`)
  2. Connect to corporate network (WireGuard VPN)
  3. Setup SSH key for remote Docker access
  4. Build and deploy via `docker compose up -d --build` over SSH
  5. Prune old Docker images (keeps last 24h)
  6. Cleanup sensitive files and disconnect VPN

### Production Deployment (`deploy-prod.yml`)

- **Trigger**: Manual workflow dispatch from GitHub UI
- **Flow**: Same as development, but runs with `production` environment protection rules
- **Optional input**: `version` tag (e.g., `v1.2.3`)

### Required Secrets & Variables

Configure these in **Settings → Secrets and variables → Actions**:

**Secrets** (encrypted):

| Name | Description |
|------|-------------|
| `WIREGUARD_CONFIG` | WireGuard client config file content |
| `HOST` | Server IP/hostname |
| `USERNAME` | SSH username |
| `SSH_KEY` | Private SSH key (authentication) |
| `SSH_PORT` | SSH port (default: 22) |

**Variables** (environment-specific, per GitHub Environment):

| Name | Description |
|------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `SHADOW_DATABASE_URL` | Prisma shadow database URL |
| `SESSION_SECRET` | Session encryption key |
| `INITIAL_USER_PASSWORD` | Default admin password |
| `PORT` | Application port (default: 3000) |
| `COOKIE_SECURE` | Secure cookie flag |
| `NOTIFICATION_API_URL` | Notification service URL |
| `NOTIFICATION_TOKEN_API_URL` | Notification token endpoint |
| `NOTIFICATION_TOKEN_NAME` | Notification token name |
| `NOTIFICATION_TOKEN_EMAIL` | Notification email |
| `NOTIFICATION_TOKEN_APPSNAME` | Notification app name |
| `APP_URL` | Public application URL |

> **Note**: `HOST`, `USERNAME`, `SSH_KEY`, `SSH_PORT` can be shared across environments or scoped per environment. If your DEV and PROD servers differ, set these as environment-scoped secrets.

### VM Setup Requirements

On your deployment servers (DEV/PROD), ensure:

1. Docker and Docker Compose V2 are installed
2. The SSH user has permissions to access the Docker daemon (in `docker` group)
3. Docker services (`migrator`, `seeder`, `app`) will be created on first deploy
4. An external MySQL/MariaDB server is accessible from the Docker host

## Project Structure

```
mars/
├── .github/workflows/     # GitHub Actions CI/CD
├── prisma/               # Database schema and migrations
├── src/
│   ├── components/      # UI components
│   ├── routes/          # Page routes
│   ├── server/          # Server-side code (controllers, repositories)
│   └── lib/             # Utilities and helpers
├── Dockerfile            # Docker build configuration
├── docker-compose.yml    # Docker Compose configuration
└── .env.example          # Environment variables template
```
