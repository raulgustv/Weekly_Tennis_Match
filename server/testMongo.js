import { getMongoDB } from "./config/mongo.js"

const test = async () =>{
    const db = await getMongoDB();

    const matches = await db.collection("matches").find().limit(2).toArray()

    console.log(matches)
};

test()