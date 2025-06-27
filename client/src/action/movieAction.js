import axios from "axios";

const BASE_URL = "http://localhost:4000/api/movie";

// Get all movies
export const getAllMovies = async () => {
  try {
    const { data } = await axios.get(BASE_URL);
    return data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    throw error;
  }
};

// Get movie by ID
export const getMovie = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie with ID ${id}:`, error);
    throw error;
  }
};

// Upload movie metadata
export const uploadMovie = async (metadata) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/generate-upload-url`, metadata);
    return data;
  } catch (error) {
    console.error("Error uploading movie metadata:", error);
    throw error;
  }
};

export const createAsset = async (metadata) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/create-asset`, metadata);
    return data;
  } catch (error) {
    console.error("Error uploading movie metadata:", error);
    throw error;
  }
};
