import { apiRequest } from "./client";

const getLookupValues = async (path) => {
  const response = await apiRequest(path);

  if (Array.isArray(response)) return response;

  return response.value || [];
};

export const searchRentals = (query = {}) =>
  apiRequest("/rentals/search", { query });

export const getStates = () => getLookupValues("/rentals/states");

export const getPropertyTypes = () =>
  getLookupValues("/rentals/property-types");

export const getRentalById = (id) => apiRequest(`/rentals/${id}`);
