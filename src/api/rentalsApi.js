const API_BASE_URL = "http://4.237.58.241:3000";

function buildQuery(params = {}) {
  const cleanParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      cleanParams[key] = value;
    }
  });

  return new URLSearchParams(cleanParams).toString();
}

export async function searchRentals(params = {}) {
  const query = buildQuery(params);
  const response = await fetch(`${API_BASE_URL}/rentals/search?${query}`);

  if (!response.ok) {
    throw new Error("Failed to fetch rentals");
  }

  return response.json();
}

export async function getStates() {
  const response = await fetch(`${API_BASE_URL}/rentals/states`);

  if (!response.ok) {
    throw new Error("Failed to fetch states");
  }

  return response.json();
}

export async function getPropertyTypes() {
  const response = await fetch(`${API_BASE_URL}/rentals/property-types`);

  if (!response.ok) {
    throw new Error("Failed to fetch property types");
  }

  return response.json();
}

export async function getRentalById(id) {
  const response = await fetch(`${API_BASE_URL}/rentals/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch rental details");
  }

  return response.json();
}