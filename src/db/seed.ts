import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Words seeded successfully');
  await pool.end();
}

seed().catch(console.error);