import { apiRequest } from "./client";

export const getMyRatings = (page = 1) =>
  apiRequest("/ratings", { query: { page } });

export const getMyRatingForRental = (id) =>
  apiRequest(`/ratings/rentals/${id}`);

export const rateRental = (id, rating) =>
  apiRequest(`/ratings/rentals/${id}`, {
    method: "POST",
    body: { rating },
  });
