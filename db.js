const { Pool } = require('pg');
const dns = require('dns');

// *** FORZAR IPv4 GLOBALMENTE ***
// Esto es necesario porque Render usa IPv6 por defecto pero Supabase no lo soporta
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // SSL requerido para Supabase
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = pool;

