import dotenv from 'dotenv';
dotenv.config();

import { pool } from "./config/neon.js";


const testConnection = async() => {

    console.log("DB URL: ", process.env.NEON_DB_URL)
    
    try {

        

        const res = await pool.query("SELECT NOW()");
        console.log('CONNECTED TO NEON: ', res.rows)
        
    } catch (error) {
        console.log(error)
    }
};

testConnection();