"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  LinearProgress,
  Grid,
  Divider,
} from "@mui/material";
import { CloudUpload, Movie, Close, Add, Delete } from "@mui/icons-material";
import { uploadMovie } from "../../action/movieAction";
import axios from "axios";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

export default function UploadPage() {
  const [movieFile, setMovieFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    language: "",
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setMovieFile(file);
      } else {
        alert("Please upload a valid video file");
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setMovieFile(file);
      } else {
        alert("Please upload a valid video file");
      }
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const addGenre = () => {
    if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
      setSelectedGenres((prev) => [...prev, selectedGenre]);
      setSelectedGenre("");
    }
  };

  const removeGenre = (genre) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movieFile) {
      alert("Please select a movie file to upload");
      return;
    }

    if (!metadata.title.trim()) {
      alert("Please enter a movie title");
      return;
    }

    setUploading(true);
    setUploadProgress(0);


    try {
      // Step 1: Upload url (signedUrl)
      const res = await uploadMovie(metadata);
      console.log(res);

      // Step 2: Upload file to Mux using axios
      await axios.put(res.uploadUrl, movieFile, {
        headers: {
          "Content-Type": movieFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percent}%`);
          setUploadProgress(percent);
        },
      });

      
      //alert("Movie uploaded successfully!")

      // Reset form
      setMovieFile(null)
      setMetadata({
        title: "",
        description: "",
        director: "",
        year: "",
        duration: "",
        language: "",
        country: "",
      })
      setSelectedGenres([])
    } catch (error) {
      console.log(error)
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <Container sx={{ py: 4, width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Upload Movie
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your movie file and add metadata information
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* File Upload Section */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Movie />
                <Typography variant="h6">Movie File</Typography>
              </Box>
            }
            subheader="Upload your movie file (MP4, MOV, AVI, etc.)"
          />
          <CardContent>
            <Paper
              sx={{
                border: 2,
                borderStyle: "dashed",
                borderColor: dragActive
                  ? "primary.main"
                  : movieFile
                  ? "success.main"
                  : "grey.300",
                backgroundColor: dragActive
                  ? "primary.50"
                  : movieFile
                  ? "success.50"
                  : "transparent",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: movieFile ? "success.main" : "grey.500",
                },
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {movieFile ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "success.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Movie sx={{ fontSize: 32, color: "success.600" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="success.700"
                    >
                      {movieFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(movieFile.size)}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setMovieFile(null)}
                  >
                    Remove File
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CloudUpload
                      sx={{ fontSize: 32, color: "text.secondary" }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Drop your movie file here
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      or click to browse
                    </Typography>
                  </Box>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="movie-upload"
                  />
                  <label htmlFor="movie-upload">
                    <Button variant="outlined" component="span">
                      Choose File
                    </Button>
                  </label>
                </Box>
              )}
            </Paper>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Uploading...</Typography>
                  <Typography variant="body2">
                    {Math.round(uploadProgress)}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Metadata Section */}
        <Card>
          <CardHeader
            title="Movie Information"
            subheader="Add details about your movie"
          />
          <CardContent sx={{ space: 3 }}>
            {/* Basic Info */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  required
                  value={metadata.title}
                  onChange={(e) =>
                    handleMetadataChange("title", e.target.value)
                  }
                  placeholder="Enter movie title"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Director"
                  value={metadata.director}
                  onChange={(e) =>
                    handleMetadataChange("director", e.target.value)
                  }
                  placeholder="Enter director name"
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={metadata.description}
                onChange={(e) =>
                  handleMetadataChange("description", e.target.value)
                }
                placeholder="Enter movie description or synopsis"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Country"
                value={metadata.country}
                onChange={(e) =>
                  handleMetadataChange("country", e.target.value)
                }
                placeholder="United States"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Genres */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Genres
              </Typography>
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Genre</InputLabel>
                  <Select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    label="Select Genre"
                  >
                    {genres
                      .filter((genre) => !selectedGenres.includes(genre))
                      .map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  onClick={addGenre}
                  disabled={!selectedGenre}
                  startIcon={<Add />}
                >
                  Add Genre
                </Button>
              </Box>
              {selectedGenres.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedGenres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onDelete={() => removeGenre(genre)}
                      deleteIcon={<Close />}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={uploading || !movieFile}
            sx={{ minWidth: 150 }}
            startIcon={uploading ? null : <CloudUpload />}
          >
            {uploading ? "Uploading..." : "Upload Movie"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
