const { Client } = require('pg');
const XLSX = require('xlsx');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
};

async function importData() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        
        // Read Excel
        const filePath = path.join(__dirname, '../../RecintosCiudadOruro.xlsx');
        console.log(`Reading Excel from ${filePath}...`);
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`Found ${data.length} records. Inserting...`);
        
        let inserted = 0;
        for (const row of data) {
            // Map columns
            const nombre = row['Recinto'];
            const direccion = row['Direccion'] || '';
            const lat = parseFloat(row['latitud']);
            const lng = parseFloat(row['longitud']);
            const tipo = row['TipoRecinto'] || '';
            const estado = row['Estado'] || '';
            
            // Log if coordinates are missing
             if (isNaN(lat) || isNaN(lng)) {
                console.warn(`Skipping ${nombre}: Invalid coordinates (${lat}, ${lng})`);
                continue;
            }

            const query = `
                INSERT INTO recintos (nombre, direccion, latitud, longitud, tipo, estado, geom, metadata)
                VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326), $9)
            `;
            
            await client.query(query, [nombre, direccion, lat, lng, tipo, estado, lng, lat, JSON.stringify(row)]);
            
            inserted++;
        }
        
        console.log(`Successfully inserted ${inserted} records.`);

    } catch (e) {
        console.error('Error importing data:', e);
    } finally {
        await client.end();
    }
}

importData();
