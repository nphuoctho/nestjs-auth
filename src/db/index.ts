import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export * from './schema.js';

export const PG_POOL = 'PG_POOL';
export const DATABASE = 'DATABASE';

export type Database = NodePgDatabase<typeof schema>;

export function createDatabase(pool: Pool): Database {
  return drizzle(pool, { schema });
}
