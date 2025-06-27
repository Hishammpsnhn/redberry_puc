const express = require("express");
const {
  getReadyVideos,
  getVideoById,
  createVideo,
} = require("../models/D_video.js");
const VideoModel = require("../models/Video.js");
const Mux = require("@mux/mux-node");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const router = express.Router();

require("dotenv").config();

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_SECRET,
});
const s3 = new AWS.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

router.get("/", async (req, res) => {
  try {
    console.log("/");
    const movies = await VideoModel.find({ status: "ready" });
    // const movies = await getReadyVideos();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/:id", async (req, res) => {
  console.log("/:id");
  try {
    const { id } = req.params;
    const movie = await VideoModel.findById(id);
    // const movie = await getVideoById(id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/upload", async (req, res) => {
  const { title, description, tags } = req.body;

  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ["public"],
      thumbnails: {
        storyboard: true,
      },
      generated_subtitles: [
        {
          language_code: "en",
          name: "English CC",
        },
      ],
    },
    cors_origin: "*",
  });

  await VideoModel.create({
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

//s3 -presigned url
router.post("/generate-upload-url", async (req, res) => {
  console.log("/generate s3 usrl");
  const fileName = `video-${Date.now()}.mp4`;
  try {
    const params = {
      Bucket: "my-upload-bucket-3610",
      Key: fileName,
      Expires: 60 * 5, // 5 min
      ContentType: "video/mp4",
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    res.json({
      uploadUrl,
      fileUrl: `https://${params.Bucket}.s3.eu-north-1.amazonaws.com/${fileName}`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/create-asset", async (req, res) => {
  const { title, description, tags, s3Url } = req.body;
  try {
    const asset = await mux.video.assets.create({
      input: [
        {
          url: s3Url, // Public S3 URL from client
          generated_subtitles: [
            {
              language_code: "en",
              name: "English CC",
            },
          ],
          thumbnails: {
            storyboard: true,
          },
        },
      ],
      playback_policy: ["public"],
    });

    await VideoModel.create({
      title,
      description,
      tags,
      status:'preparing',
      uploadId: s3Url,
    });
    res.json({
      status:'preparing',
      assetId:asset.id
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// analytics or metrics

router.get("/video-views", async (req, res) => {
  console.log(mux);
  const views = await mux.data.videoViews.list({
    order: "desc",
  });
  res.json(views.data);
});
module.exports = router;
