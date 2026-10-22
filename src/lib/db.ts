import type { D1Database } from '@cloudflare/workers-types';

export class Database {
  constructor(private db: D1Database) {}

  async getUserByEmail(email: string) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  }
}
