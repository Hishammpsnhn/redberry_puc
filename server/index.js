const express = require("express");

const movieRoute = require('./routes/movieRoutes.js')
const dbConfig = require("./config/db");
// const VideoModel = require("./models/Video.js");


//ddb
// const dbClient = require("./config/Ddb.js");


require("dotenv").config();
const cors = require("cors");
const webhookRoute = require("./routes/webhook.js");

const app = express();
app.use("/webhook", webhookRoute);
app.use(express.json());
app.use(cors());
dbConfig();




app.use("/api/movie",movieRoute)
app.listen(4000, () => console.log("Server running on port 4000"));
