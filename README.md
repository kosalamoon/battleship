# Battleship API

A REST API for a one sided Battleship game built with NestJS, TypeORM, and PostgreSQL.

The game is played on a 10x10 grid with randomly placed ships (1× Battleship, 2× Destroyers). The player fires shots at coordinates and receives hit/miss/sunk feedback until all ships are sunk.

## Prerequisites

- **Node.js** >= 20 and **npm** (for manual setup)
- **Docker** and **Docker Compose** (for Docker setup)
- **PostgreSQL 18** (for manual setup only)

## Environment Variables

Create a `.env` file in the project root.

| Variable                 | Description                                      | Example         |
| ------------------------ | ------------------------------------------------ | --------------- |
| `API_ENV`                | Environment name                                 | `dev`           |
| `LOG_LEVEL`              | Logging level (`debug`, `info`, `warn`, `error`) | `debug`         |
| `PORT`                   | HTTP port the API listens on                     | `3000`          |
| `DB_HOST`                | PostgreSQL host                                  | `localhost`     |
| `DB_PORT`                | PostgreSQL port                                  | `5432`          |
| `DB_USERNAME`            | PostgreSQL username                              | `postgres_user` |
| `DB_PASSWORD`            | PostgreSQL password                              | `postgres@123`  |
| `DB_NAME`                | PostgreSQL database name                         | `battleship`    |
| `GRID_SIZE`              | Game grid size (default: 10)                     | `10`            |
| `MAX_PLACEMENT_ATTEMPTS` | Max ship placement retries                       | `1000`          |

---

## Option 1: Docker Compose

This starts both the PostgreSQL database and the API together.

**1. Create your `.env` file** (see table above).

**2. Start all services:**

```bash
docker compose up -d --build
```

**3. Run database migrations** (in a separate terminal, once the containers are up):

```bash
docker exec battleship-api npm run migration:run
```

Or

```bash
docker compose exec api npm run migration:run
```

This creates the schema and seeds the initial ship types and game configuration.

**4. The API is available at:** `http://localhost:3000`

To stop the services:

```bash
docker compose down
```

---

## Option 2: Manual Setup (npm + local PostgreSQL)

**1. Install dependencies:**

```bash
npm install
```

**2. Create a PostgreSQL database** matching the `DB_NAME` in your `.env`, then update `.env` with your `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD`.

**3. Run database migrations:**

```bash
npm run migration:run
```

This creates all tables and seeds the initial ship types and game configuration.

**4. Start the API:**

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

**5. The API is available at:** `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint       | Description                                 |
| ------ | -------------- | ------------------------------------------- |
| `POST` | `/games/start` | Start a new game with randomly placed ships |
| `POST` | `/games/shoot` | Fire a shot at a grid position              |
| `GET`  | `/games/:id`   | Get the current state of a game             |

### POST /games/start

Returns the game ID, grid size, and the positions of all placed ships.

### POST /games/shoot

Request body:

```json
{
  "gameId": "<uuid>",
  "position": "A5"
}
```

Position format: letter `A`–`J` (column) followed by number `1`–`10` (row).

Returns the shot result: `HIT`, `MISS`, or `ALREADY_SHOT`, whether a ship was sunk, and whether the game is over.

### GET /games/:id

Returns game status, all shots fired so far, and the count of remaining ships.

---

## Database

See the [ER Diagram](https://dbdiagram.io/d/battleship-69a3c76ba3f0aa31e16aebad) for the full data model.

Migrations are located in `src/database/migrations/`. Running `migration:run` applies all pending migrations in order, including the seed data for ship types and game configuration.

---

## Available Scripts

| Script                       | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `npm run start:dev`          | Start in development watch mode              |
| `npm run start:prod`         | Start compiled production build              |
| `npm run build`              | Compile TypeScript to `dist/`                |
| `npm run test`               | Run unit tests                               |
| `npm run test:e2e`           | Run end-to-end tests                         |
| `npm run test:cov`           | Run tests with coverage report               |
| `npm run migration:run`      | Apply all pending migrations                 |
| `npm run migration:revert`   | Revert the last applied migration            |
| `npm run migration:generate` | Generate a new migration from entity changes |
| `npm run migration:create`   | Create a new empty migration file            |
