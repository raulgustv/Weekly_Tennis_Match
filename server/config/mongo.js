import dotenv from 'dotenv';
dotenv.config();

import {MongoClient} from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

let db = null;

export const getMongoDB = async() =>{

    if(db) return db;

    await client.connect()

    db = client.db("test");

    console.log('Mongo connection success')

    return db;


}