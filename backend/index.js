require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {UserDBconnection, FileDBConnection} = require("./db/db.js");
const authRoute = require("./routes/auth.js");
const fileRoute = require("./routes/fileRoute.js")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

UserDBconnection();


app.use("/auth", authRoute);
app.use("/files",fileRoute);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
