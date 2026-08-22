// scripts/resetDummyPasswords.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const password = "123456";

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.updateMany(
            {
                provider: "local"
            },
            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        console.log(`Users matched: ${result.matchedCount}`);
        console.log(`Users modified: ${result.modifiedCount}`);

    } catch (error) {
        console.error("Error resetting passwords:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

run();