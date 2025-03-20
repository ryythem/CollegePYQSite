require("dotenv").config();
const admin = require("firebase-admin");

// Parse the service account key from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "pyqs-878b0.appspot.com",
});

const bucket = admin.storage().bucket();
module.exports = { bucket };
