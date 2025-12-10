const { Pool } = require('pg');

const pool = new Pool({
  // Parámetros explícitos extraídos de la URL
  user: 'postgres', // Usuario predeterminado de Supabase
  password: process.env.DB_PASSWORD, // Usa la nueva variable de entorno
  host: process.env.DB_HOST || 'db.albllifgogsxzvoijjfl.supabase.co', // Usa la variable DB_HOST o el valor fijo
  port: 5432,
  database: 'postgres',
  
  // *** SOLUCIÓN CLAVE ***
  family: 4, 
  
  // SSL requerido
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;