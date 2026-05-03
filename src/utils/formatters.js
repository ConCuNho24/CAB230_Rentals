export const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "Not listed";

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatRating = (averageRating, numRatings = 0) => {
  if (!averageRating || numRatings === 0) return "No ratings";

  return `${Number(averageRating).toFixed(2)} stars (${numRatings})`;
};

export const formatUserRating = (rating) => {
  if (!rating) return "Not rated";

  return `${rating} ${Number(rating) === 1 ? "star" : "stars"}`;
};

export const formatDateTime = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

// Convert API values such as "townhouse/duplex" into readable labels.
export const formatPropertyType = (value = "") =>
  value
    .split("/")
    .map((part) =>
      part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("-"),
    )
    .join("/");

// Remove API HTML while preserving paragraph breaks from <br> tags.
export const cleanDescription = (description = "") =>
  description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
