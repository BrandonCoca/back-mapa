const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
};

async function setup() {
    console.log('Connecting to postgres...');
    const client = new Client({ ...dbConfig, database: 'postgres' });
    try {
        await client.connect();
        
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
        if (res.rowCount === 0) {
            console.log(`Creating database ${process.env.DB_NAME}...`);
            await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
        } else {
            console.log(`Database ${process.env.DB_NAME} already exists.`);
        }
    } catch (e) {
        console.error('Error creating database:', e);
    } finally {
        await client.end();
    }

    // Now connect to the new DB to setup schema
    console.log(`Connecting to ${process.env.DB_NAME}...`);
    const dbClient = new Client({ ...dbConfig, database: process.env.DB_NAME });
    try {
        await dbClient.connect();
        console.log('Enabling PostGIS...');
        await dbClient.query('CREATE EXTENSION IF NOT EXISTS postgis');

        console.log('Dropping existing table...');
        await dbClient.query('DROP TABLE IF EXISTS recintos');
        
        console.log('Creating table recintos...');
        await dbClient.query(`
            CREATE TABLE recintos (
                id SERIAL PRIMARY KEY,
                nombre TEXT,
                direccion TEXT,
                latitud DOUBLE PRECISION,
                longitud DOUBLE PRECISION,
                tipo TEXT,
                estado TEXT,
                geom GEOMETRY(POINT, 4326),
                metadata JSONB
            );
        `);
        console.log('Schema setup complete.');
    } catch (e) {
        console.error('Error setting up schema:', e);
    } finally {
        await dbClient.end();
    }
}

setup();
