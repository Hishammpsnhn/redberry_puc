import axios from "axios";

export const getAllMovies = async () => {
  const response = await axios.get(
    "http://localhost:4000/api/movies",
    {}
  );

  return response.data;
};
export const getMovie = async (id) => {
  const response = await axios.get(`http://localhost:4000/api/movie/${id}`);
  return response.data;
};
export const uploadMovie = async (metadata) => {
  console.log(metadata);
  const response = await axios.post(
    "http://localhost:4000/api/upload",
    metadata,
    {}
  );

  return response.data;
};
