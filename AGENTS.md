# Repository Guidelines

## Project Overview

NestJS 12 backend for an auth service (JWT access/refresh, email verification, password reset) backed by PostgreSQL via Drizzle ORM. The repo is early-stage: `src/` has bootstrap, global `ConfigModule`, and a wired Drizzle DB layer — no controllers, services, or guards exist yet. `README.md` is untouched NestJS starter boilerplate; do not treat it as authoritative.

## Architecture & Data Flow

- `src/db/schema.ts` — Drizzle `pg-core` tables: `users` (uuid PK, unique email, `password_hash`, role enum, verification/reset/refresh-token fields, timestamps) and `tasks` (uuid PK, `user_id` FK → `users.id` cascade, `task_status` enum).
- `src/db/index.ts` — Drizzle client factory (`createDatabase`), `Database` type (`NodePgDatabase<typeof schema>`), injection tokens `PG_POOL`/`DATABASE`; re-exports the schema.
- `src/db/db.module.ts` — global `DbModule`: builds `pg.Pool` from `DATABASE_URL` via `ConfigService`, provides `DATABASE` (drizzle client), exports it, closes the pool in `onModuleDestroy`. Inject with `@Inject(DATABASE) private db: Database`.
- Intended flow: request → controller → injectable service → `DATABASE` (Drizzle) → Postgres. Deps already installed for auth: `@nestjs/jwt`, `bcryptjs`, `cookie-parser`, `class-validator`/`class-transformer`, `@nestjs/swagger`, `@nestjs/throttler`, `resend`.
- `src/app.module.ts` — root module; registers global `ConfigModule` and `DbModule`. No controllers/providers.
- `src/main.ts` — bootstrap; `enableShutdownHooks()` is on so `DbModule.onModuleDestroy` closes the pool.

## Key Directories

- `src/` — application source (`nest-cli.json` `sourceRoot`).
- `src/db/` — Drizzle schema, client factory, and global `DbModule`.
- `test/` — e2e specs (`*.e2e-spec.ts`); unit specs (`*.spec.ts`) may live anywhere but `test/` is the convention lint/format scripts assume.
- `dist/` — build output (gitignored; `deleteOutDir` on).

## Development Commands

Package manager is **pnpm** (lockfile v9). All commands via `pnpm run`:

| Command | Action |
|---|---|
| `start` / `start:dev` / `start:debug` | `nest start` / `--watch` / `--debug --watch` |
| `start:prod` | `node dist/main` |
| `build` | `nest build` → `dist/` |
| `lint` | `oxlint src/ test/` |
| `format` | `prettier --write "src/**/*.ts" "test/**/*.ts"` |
| `test` / `test:watch` / `test:cov` | `vitest run` / `vitest` / `vitest run --coverage` |
| `test:e2e` | `vitest run --config ./vitest.config.e2e.ts` |
| `test:debug` | `vitest --inspect-brk --no-file-parallelism` |
| `db:generate` / `db:migrate` / `db:push` / `db:studio` | `drizzle-kit` migration workflow |

Local DB: `docker compose up -d` starts `postgres:17-alpine` (`nest-auth-db`) using `DATABASE_*` vars from `.env`. Copy `.env.example` → `.env` first. Schema changes: edit `src/db/schema.ts` → `pnpm db:generate` (emits SQL into `drizzle/`) → `pnpm db:migrate`. `drizzle.config.ts` reads `DATABASE_URL` from `.env` (drizzle-kit auto-loads dotenv).

## Code Conventions & Common Patterns

- **ESM, NodeNext resolution**: local imports need explicit `.js` extensions (`import { AppModule } from './app.module.js'`). `"type": "module"`.
- **TypeScript**: `strict` on, `strictPropertyInitialization` off (standard for Nest DI), decorators + `emitDecoratorMetadata` on, target ES2023. No path aliases.
- **Naming**: PascalCase classes/types (`AppModule`, `User`, `NewUser`); camelCase TS properties; snake_case DB columns (`password_hash`, `user_id`); plural table constants (`users`, `tasks`); `*Enum` suffix for `pgEnum` (`userRoleEnum`); `New*` prefix for insert types (`NewUser`).
- **Style**: Prettier — single quotes, trailing commas; semicolons. Oxlint — `no-explicit-any` off, `no-floating-promises` warn.
- **DI**: standard Nest constructor injection; `ConfigService` is globally injectable (ConfigModule is global).
- **Async**: async/await only; no promise chains/callbacks.
- **Validation**: when adding endpoints, use class-validator DTOs + `ValidationPipe` (deps installed; pipe not yet registered in `main.ts`).

## Important Files

- `src/main.ts` — entry point; add global pipes/filters/Swagger here.
- `src/app.module.ts` — root module; register feature modules here.
- `src/db/schema.ts` — Drizzle schema; `src/db/index.ts` — client + tokens; `src/db/db.module.ts` — global module; `drizzle.config.ts` + `drizzle/` — kit config and generated migrations.
- `.env.example` — required env vars: `PORT`, `DATABASE_{PORT,NAME,USER,PASSWORD,URL}`, `JWT_{ACCESS,REFRESH}_{SECRET,EXPIRES_IN}`, `APP_URL`, `RESEND_API_KEY`. `.env` is gitignored — never commit secrets.
- `docker-compose.yml` — Postgres 17 dev database.
- `vitest.config.ts` / `vitest.config.e2e.ts` — unit vs e2e split by filename glob.
- `tsconfig.json` / `tsconfig.build.json` — build narrows to `src/`, excludes tests.
- `oxlint.json`, `.prettierrc`, `nest-cli.json` — tooling config.

## Runtime/Tooling Preferences

- **pnpm only** — `pnpm-lock.yaml` + `pnpm-workspace.yaml`; no npm/yarn/bun config.
- **Node** — no `engines` field; transitive deps suggest Node ≥ 22. Production runs plain `node dist/main` (no Bun).
- PostgreSQL 17 via docker-compose; `pg` driver + `drizzle-orm`.
- No CI, git hooks, `scripts/`, or `docs/` directories.

## Testing & QA

- **Vitest 4** with `globals: true` (no imports needed for `describe`/`it`/`expect`); `vite-tsconfig-paths` in both configs.
- **Unit**: `*.spec.ts` → `pnpm test`. None exist yet.
- **E2E**: `*.e2e-spec.ts` → `pnpm test:e2e`. Pattern: `Test.createTestingModule({ imports: [AppModule] })` → `app.init()` → Supertest `request(app.getHttpServer())` → `app.close()` in `afterEach`. See `test/app.e2e-spec.ts`.
- Coverage via `pnpm test:cov` (`@vitest/coverage-v8`); no thresholds configured.
- No test DB/fixtures/setup files exist. `AppModule` now includes `DbModule`, so e2e tests boot a real `pg.Pool` — they need `DATABASE_URL` reachable (docker compose) or an override of the `DATABASE` provider.
