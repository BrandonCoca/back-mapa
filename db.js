const { Pool } = require('pg');

const pool = new Pool({
  // Utiliza la variable de entorno DATABASE_URL configurada en Render
  connectionString: process.env.DATABASE_URL, 
  
  // SSL requerido para Supabase/nube
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;
