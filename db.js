const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // Forzar IPv4 para evitar error ENETUNREACH en Render
  family: 4,
  
  // SSL requerido para Supabase
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;
