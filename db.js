const { Pool } = require('pg');

const pool = new Pool({
  // Utiliza la variable de entorno DATABASE_URL configurada en Render
  connectionString: process.env.DATABASE_URL, 
  host: 'db.albllifgogsxzvoijjfl.supabase.co', // Vuelve a especificar el host para asegurar que se aplique 'family'
  family: 4,
  // SSL requerido para Supabase/nube
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;
