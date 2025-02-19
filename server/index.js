const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routeData = require("./routes/routeData");
const db = require("./config/connectdb");

dotenv.config(); 

const app = express();


db();


app.use(express.json()); 
app.use(cors()); 


app.use("/api/users", routeData);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening at PORT ${PORT}`);
});
