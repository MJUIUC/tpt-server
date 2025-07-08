# TPT Server

This is a server for the paper trail website.

## Project Structure

```
tpt-server/
├── docker-compose.local.yml   # Local Docker Compose config
├── docker-compose.yml         # Production Docker Compose config
├── Dockerfile                 # Docker build instructions
├── nodemon.json               # Nodemon config for development
├── package.json               # Node.js dependencies and scripts
├── pnpm-lock.yaml             # pnpm lockfile
├── README.md                  # Project documentation
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Vitest test runner config
├── prisma/                    # Prisma ORM schema, migrations, and seed
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migration history
├── scripts/                   # Utility and setup scripts
│   ├── dev.sh                 # Development startup script
│   ├── minio-init.sh          # MinIO initialization script
│   ├── minio-utils.sh         # MinIO utility functions
│   └── public-read-policy.json# MinIO policy config
└── src/                       # Source code
    ├── main/                  # Main application code
    │   ├── FileHandler.ts     # File handling logic
    │   ├── Index.ts           # Main server entry point
    │   └── ...                # Other core modules
    └── test/                  # Tests
```

## Local Development & Startup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Docker](https://www.docker.com/) (for database and MinIO)

### 1. Clone the repository
```sh
git clone <repo-url>
cd tpt-server
```

### 2. Install dependencies
```sh
pnpm install
```

### 3. Start required services (Postgres & MinIO) with Docker Compose
```sh
docker-compose -f docker-compose.local.yml up -d
```

### 4. Run database migrations and seed (if needed)
```sh
pnpm prisma migrate dev
pnpm prisma db seed
```

### 5. Start the development server
```sh
pnpm dev
```

The server should now be running locally. By default, it listens on `http://localhost:3000` (or as configured).

### Quick Start (All-in-One Script)

You can use the provided development script to automate all the above steps:

```sh
./scripts/dev.sh
```

This script will:
- Start Docker services (Postgres & MinIO)
- Run database migrations and seed
- Start the development server

---

## Directory Overview

- **prisma/**: Contains database schema, migration files, and seed scripts for initializing and updating the database.
- **scripts/**: Shell scripts for development, MinIO setup, and utility functions.
- **src/main/**: Main server application code, including file handling and server logic.
- **src/test/**: Test files for the server code.

## Architecture Diagram

```
+-------------------+
|   Client (Web)    |
+--------+----------+
         |
         v
+--------+----------+
|   tpt-server API  |
|  (Node.js/TS)     |
+--------+----------+
         |
   +-----+-----+   +----------------+
   |  Prisma   |   |   MinIO (S3)   |
   |  (ORM)    |   |   (Object      |
   |           |   |    Storage)    |
   +-----+-----+   +----------------+
         |
         v
+--------+----------+
|   Database (PG)   |
+-------------------+
```

- The server exposes an API for the web client.
- Uses Prisma ORM to interact with a PostgreSQL database.
- Uses MinIO for object/file storage (S3-compatible).

---

For more details, see individual files and scripts in each directory.
