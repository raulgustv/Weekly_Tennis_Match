import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conexión exitosa ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error de conexión a db: ${error}`);
        process.exit(1)
    }
}


export default connectDB;