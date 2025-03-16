require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DBconnection = require("./db/db.js");
const authRoute = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(express.json());

DBconnection();

app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
