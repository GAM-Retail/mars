# MARS - Meeting Area Reservation System

A web application for managing meeting rooms and reservations. Built with [SolidStart](https://docs.solidjs.com/solid-start/) and [SolidJS](https://docs.solidjs.com/).

## Tech Stack

- **Framework**: SolidStart 2.0 (SolidJS)
- **Database**: MySQL (via Prisma ORM)
- **Styling**: Tailwind CSS + Shadcn UI
- **Package Manager**: pnpm
- **Deployment**: Docker

## Prerequisites

- Node.js >= 22
- pnpm >= 10.33
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

The project includes GitHub Actions workflows for automated deployment:

### Development Deployment

- **Trigger**: Push to `master` branch
- **Action**: Builds Docker on DEV server, deploys via SSH
- **Required secrets**:
  - `DEV_HOST` - DEV server IP/hostname
  - `DEV_USERNAME` - SSH username
  - `DEV_SSH_KEY` - Private SSH key
  - `DEV_SSH_PORT` - SSH port (default: 22)

### Production Deployment

- **Trigger**: Manual workflow dispatch with version tag (e.g., `v1.0.0`)
- **Action**: Builds Docker on PROD server, deploys via SSH
- **Required secrets**:
  - `PROD_HOST` - PROD server IP/hostname
  - `PROD_USERNAME` - SSH username
  - `PROD_SSH_KEY` - Private SSH key
  - `PROD_SSH_PORT` - SSH port (default: 22)

### Setting Up GitHub Secrets

1. Go to your repository settings
2. Navigate to Secrets and variables > Actions
3. Add the required secrets

### VM Setup Requirements

On your deployment servers (DEV/PROD), ensure:

1. Docker and Docker Compose are installed
2. Clone the repository to `/opt/mars`
3. Create `.env` file with production database credentials
4. SSH access is configured with the private key

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
