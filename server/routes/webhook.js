// routes/webhook.js
const express = require("express");
const Mux = require("@mux/mux-node");
const bodyParser = require("body-parser");
const VideoModel = require("../models/Video");

const MUX_WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_SECRET,
});
const router = express.Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
   async(req, res) => {
    console.log("webhook")
    try {
      const rawBody = req.body.toString("utf8");
      const isValidSignature = mux.webhooks.verifySignature(
        rawBody,
        req.headers,
        MUX_WEBHOOK_SECRET
      );
      const event = JSON.parse(rawBody);

      console.log("📌 Event Type:", event.type);
      if (event.type === "video.asset.ready") {
        const assetId = event.data.id;
        const uploadId = event.data.upload_id;
        const playbackId = event.data.playback_ids?.[0]?.id;

        console.log("🎉 Video Ready:", { uploadId, assetId, playbackId });

        // Update video in DB
        const updated = await VideoModel.findOneAndUpdate(
          { uploadId },
          {
            assetId,
            playbackId,
            status: "ready",
          },
          { new: true }
        );

        if (!updated) {
          console.warn("⚠️ No video found for uploadId:", uploadId);
        }
      }
      res.status(200).send("OK");
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      res.status(400).send("Invalid signature");
    }
  }
);

module.exports = router;
