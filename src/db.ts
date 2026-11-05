import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URL
  : process.env.DATABASE_PUBLIC_URL;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export async function testConnection() {
  const res = await pool.query('SELECT NOW() as time');
  console.log('✅ Database connected at:', res.rows[0].time);
}