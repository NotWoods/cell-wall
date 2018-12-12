import { existsSync } from 'fs';
import { config } from 'dotenv';

if (existsSync('.env')) {
    console.log('Using .env file to supply config enviornment variables');
    config({ path: '.env' });
} else {
    console.log('Using .env.example to supply config enviornment variables');
    config({ path: '.env.example' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'
