const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/recintos', async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, direccion, tipo, estado, ST_AsGeoJSON(geom)::json as geometry
      FROM recintos
      WHERE tipo NOT ILIKE '%carcel%' AND tipo NOT ILIKE '%penal%'
    `;
    const result = await pool.query(query);
    
    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        nombre: row.nombre,
        direccion: row.direccion,
        tipo: row.tipo,
        estado: row.estado
      }
    }));

    res.json({
      type: 'FeatureCollection',
      features: features
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/search', async (req, res) => {
  const { lat, lng, radius } = req.body;
  
  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const query = `
      SELECT id, nombre, direccion, tipo, estado, ST_AsGeoJSON(geom)::json as geometry,
             ST_Distance(geom::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography) as dist
      FROM recintos
      WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography, $3)
      AND tipo NOT ILIKE '%carcel%' AND tipo NOT ILIKE '%penal%'
      ORDER BY dist;
    `;
    const values = [lng, lat, radius];
    const result = await pool.query(query, values);
    
    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        nombre: row.nombre,
        direccion: row.direccion,
        tipo: row.tipo,
        estado: row.estado,
        distance: row.dist
      }
    }));

    res.json({
      type: 'FeatureCollection',
      features: features
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
