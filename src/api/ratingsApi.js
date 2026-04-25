const API_BASE_URL = "http://4.237.58.241:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyRatingForRental(id) {
  const response = await fetch(`${API_BASE_URL}/ratings/rentals/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch your rating");
  }

  return response.json();
}

export async function rateRental(id, rating) {
  const response = await fetch(`${API_BASE_URL}/ratings/rentals/${id}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit rating");
  }

  return response.json();
}