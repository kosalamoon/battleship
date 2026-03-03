# WireApps Back-End Technical Assessment — Q&A

## Question 1: Main API Endpoints

| HTTP Method | URL            | Description                                                                                                        |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| POST        | `/games/start` | Start a new game — creates a game, randomly places ships on the 10×10 grid, returns the initial game state         |
| GET         | `/games/:id`   | Get current game state — returns game status, all shots fired so far, and remaining ships                          |
| POST        | `/games/shoot` | Fire a shot at a position (e.g. `{ "position": "A5" }`) — returns hit/miss result and reports if a vessel was sunk |

---

## Question 2: Data Models

See the [Database Diagram](https://dbdiagram.io/d/battleship-69a3c76ba3f0aa31e16aebad) for the full data model.

### Game

| Column | Type    | Notes                                         |
| ------ | ------- | --------------------------------------------- |
| id     | UUID    | Primary Key                                   |
| status | VARCHAR | `NOT_STARTED` \| `IN_PROGRESS` \| `COMPLETED` |

### ShipType

| Column | Type    | Notes                                   |
| ------ | ------- | --------------------------------------- |
| id     | UUID    | Primary Key                             |
| name   | VARCHAR | Unique (e.g. `Battleship`, `Destroyer`) |
| size   | INTEGER | Number of grid squares (e.g. 5, 4)      |

### ShipInstance

| Column     | Type    | Notes                                 |
| ---------- | ------- | ------------------------------------- |
| id         | UUID    | Primary Key                           |
| gameId     | UUID    | FK → Game                             |
| shipTypeId | UUID    | FK → ShipType                         |
| hitCount   | INTEGER | Number of hits taken so far           |
| isSunk     | BOOLEAN | `true` when hitCount equals ship size |

### ShipPosition

| Column         | Type    | Notes                               |
| -------------- | ------- | ----------------------------------- |
| id             | UUID    | Primary Key                         |
| shipInstanceId | UUID    | FK → ShipInstance                   |
| position       | VARCHAR | Board coordinate (e.g. `A1`, `J10`) |
| isHit          | BOOLEAN | `true` if this cell has been shot   |

### Shot

| Column   | Type    | Notes                              |
| -------- | ------- | ---------------------------------- |
| id       | UUID    | Primary Key                        |
| gameId   | UUID    | FK → Game                          |
| position | VARCHAR | Board coordinate that was targeted |
| success  | BOOLEAN | `true` = hit, `false` = miss       |

### GameConfig

| Column     | Type    | Notes                               |
| ---------- | ------- | ----------------------------------- |
| id         | UUID    | Primary Key                         |
| name       | VARCHAR | Config name (e.g. `DEFAULT_CONFIG`) |
| shipTypeId | UUID    | FK → ShipType                       |
| count      | INTEGER | How many of this ship type per game |

**Default seeded configuration:** 1× Battleship (size 5) and 2× Destroyers (size 4).

---

## Question 3: Frameworks / Libraries

| Name of the package         | What would you accomplish using that?                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| NestJS                      | application framework                                                                         |
| TypeORM                     | ORM for defining entities, running migrations, and querying the database without raw SQL      |
| `pg`                        | PostgreSQL driver — connects Node.js to the PostgreSQL database                               |
| `class-validator`           | Validates incoming request payloads using decorators on DTO classes                           |
| `class-transformer`         | Transforms plain JSON objects into typed class instances for validation and serialization     |
| `dotenv`                    | Loads environment variables (DB host, port, credentials) from a `.env` file                   |
| `typeorm-naming-strategies` | Automatically converts camelCase entity properties to snake_case column names in the database |
| `Jest` / `ts-jest`          | Unit and integration test runner with TypeScript support                                      |

---

## Question 4: Main Programs and Tools

| Name of the program     | What would you accomplish using that?                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Visual Studio Code      | IDE                                                                         |
| GitHub Copilot          | Autocompletes & code suggestions                                            |
| Claude Code             | generate docs and boilerplates, validate complex logic, find out edge cases |
| DataGrip                | Database UI tool                                                            |
| Postman                 | API client                                                                  |
| Git / GitHub            | Version control                                                             |
| Docker / Docker Compose | Containerization and local development                                      |
