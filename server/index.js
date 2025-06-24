const express = require("express");
const Mux = require('@mux/mux-node');
const dbConfig = require("./config/db");
require("dotenv").config();
const VideoModel = require("./models/Video.js");
const cors = require("cors");
const webhookRoute = require('./routes/webhook.js')

const app = express();
app.use('/webhook', webhookRoute); 
app.use(express.json());
app.use(cors());
dbConfig();

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_SECRET,
});
app.post("/api/upload", async (req, res) => {
  const { title, description, tags } = req.body;
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: "public",
    },
    cors_origin: "*",
  });

  const video = VideoModel.create({
    title,
    description,
    tags,
    uploadId: upload.id,
  });

  res.json({
    uploadUrl: upload.url,
    uploadId: upload.id,
  });
});
app.get('/api/movies',async(req,res)=>{
  try {
    const movies =await VideoModel.find({status:'ready'})
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json(error)
  }
})
app.get('/api/movie/:id',async(req,res)=>{
  try {
    const {id} = req.params;
    const movie =await VideoModel.findById(id)
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.listen(4000, () => console.log("Server running on port 4000"));
