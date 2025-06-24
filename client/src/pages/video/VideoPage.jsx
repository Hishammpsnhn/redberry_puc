import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@mux/mux-player"; // registers <mux-player>
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { getMovie } from "../../action/movieAction";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getMovie(id);
        console.log(res);
        setVideo(res);
      } catch (error) {
        console.error("Failed to fetch video", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!video) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6">Video not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        {video.title}
      </Typography>

      <mux-player
        playback-id={video.playbackId}
        stream-type="on-demand"
        metadata-video-title={video.title}
        initial-rendition-index={0} //low quality inital
        controls
        style={{ width: "100%", aspectRatio: "16/9", borderRadius: "12px" }}
      ></mux-player>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {video.description}
      </Typography>
    </Box>
  );
};

export default VideoPage;
