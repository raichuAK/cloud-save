import { Connection } from 'postgresql-client';
import Pool from 'pg-pool';

class Database {
  async getPool() {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
}

export default Database;