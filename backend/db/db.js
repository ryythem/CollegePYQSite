require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URL_USER = process.env.MONGO_URL_USER;
const MONGO_URL_FILE = process.env.MONGO_URL_FILE;

const UserDBconnection = async () => {
  await mongoose
    .connect(MONGO_URL_USER)
    .then(() => {
      console.log("Connected to User database successfully");
    })
    .catch((e) => {
      console.log("Error connecting User to database");
    });
};

const FileDBConnection = mongoose.createConnection(MONGO_URL_FILE);

FileDBConnection.on("connected", () => {
  console.log("Connected to File DB successfully");
});
FileDBConnection.on("error", (e) => {
  console.log(" Error connecting to File Database:", e);
});

module.exports = { UserDBconnection, FileDBConnection };
