import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
console.log("DB URL:", process.env.DATABASE_URL)
const pool = new Pool({
  user: process.env.PG_USER,         // from .env
  host: process.env.PG_HOST,         // from .env
  database: process.env.PG_DATABASE, // from .env
  password: process.env.PG_PASSWORD, // from .env
  port: process.env.PG_PORT,          // from .env
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Crucial for Neon and Render
  },
  // If Neon still gives a 28P01, this helps with password parsing
  options: '-c client_encoding=utf8'
});
// Test connection immediately
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Connection Error (Check your password):', err.stack);
  }
  console.log('✅ Connected to Neon successfully!');
  release();
});

// Helper function to keep code clean
export const query = (text, params) => pool.query(text, params);
