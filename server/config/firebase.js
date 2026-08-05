import admin from "firebase-admin";
//import serviceAccount from '../weeklytennis-firebase-adminsdk-fbsvc-240ec5aa4c.json' with { type: "json" }
import dotenv from 'dotenv'

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey//.replace(/\\n/g, "\n")
  }),
});



export default admin;