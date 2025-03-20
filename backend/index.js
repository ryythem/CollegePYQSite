require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {UserDBconnection} = require("./db/db.js");
const authRoute = require("./routes/auth.js");
const fileRoute = require("./routes/fileRoute.js")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

UserDBconnection();


app.use("/auth", authRoute);
app.use("/files",fileRoute);

app.use((err,req,res,next)=>{
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
