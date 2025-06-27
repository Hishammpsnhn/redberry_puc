import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import { getAllMovies } from "../../action/movieAction";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await getAllMovies();
        setMovies(res);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">🎬 Latest Movies</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/upload")}>
          Upload Movie
        </Button>
      </Box>

      <Grid container spacing={4}>
        {movies.map((movie) => {
          const thumbnail = movie.thumbnailUrl || `https://image.mux.com/${movie.playbackId}/thumbnail.jpg`;
          const animatedGif = `https://image.mux.com/${movie.playbackId}/animated.gif?width=320`;

          return (
            <Grid item xs={12} sm={6} md={4} key={movie._id}>
              <Card>
                <CardMedia
                  onClick={() => navigate(`/video/${movie._id}`)}
                  component="img"
                  height="200"
                  image={hoveredId === movie._id ? animatedGif : thumbnail}
                  alt={movie.title}
                  sx={{ cursor: "pointer", transition: "0.3s" }}
                  onMouseEnter={() => setHoveredId(movie._id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Home;

