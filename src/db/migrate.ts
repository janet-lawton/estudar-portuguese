import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Tables created successfully');
  await pool.end();
}

migrate().catch(console.error);