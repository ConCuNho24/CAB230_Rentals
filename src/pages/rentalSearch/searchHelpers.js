export const PAGE_SIZE = 10;

// One source of truth for all filter fields used by RentalSearch.
const DEFAULT_FILTERS = {
  suburb: "",
  state: "",
  postcode: "",
  propertyTypes: [],
  minimumRent: "",
  maximumRent: "",
  minimumBathrooms: "",
  maximumBathrooms: "",
  minimumBedrooms: "",
  maximumBedrooms: "",
  minimumParking: "",
  maximumParking: "",
  minimumRating: "",
  maximumRating: "",
  sortBy: "",
  sortOrder: "",
};

export const numberFilters = [
  ["minimumRent", "Min Rent"],
  ["maximumRent", "Max Rent"],
  ["minimumBedrooms", "Min Bedrooms"],
  ["maximumBedrooms", "Max Bedrooms"],
  ["minimumBathrooms", "Min Bathrooms"],
  ["maximumBathrooms", "Max Bathrooms"],
  ["minimumParking", "Min Parking"],
  ["maximumParking", "Max Parking"],
  ["minimumRating", "Min Rating"],
  ["maximumRating", "Max Rating"],
];

export const sortOptions = [
  ["", "Default"],
  ["id", "ID"],
  ["title", "Title"],
  ["rent", "Rent"],
  ["propertyType", "Property Type"],
  ["postcode", "Postcode"],
  ["state", "State"],
  ["suburb", "Suburb"],
  ["bathrooms", "Bathrooms"],
  ["bedrooms", "Bedrooms"],
  ["parkingSpaces", "Parking"],
  ["averageRating", "Average Rating"],
  ["numRatings", "Rating Count"],
];

const rangeChecks = [
  ["minimumRent", "maximumRent", "rent"],
  ["minimumBedrooms", "maximumBedrooms", "bedrooms"],
  ["minimumBathrooms", "maximumBathrooms", "bathrooms"],
  ["minimumParking", "maximumParking", "parking"],
  ["minimumRating", "maximumRating", "rating"],
];

export const createEmptyFilters = () => ({
  ...DEFAULT_FILTERS,
  propertyTypes: [],
});

export const validateFilters = (filters) => {
  if (
    filters.postcode &&
    (Number(filters.postcode) < 0 || Number(filters.postcode) > 9999)
  ) {
    return "Postcode must be between 0 and 9999.";
  }

  if (
    filters.minimumRating &&
    (Number(filters.minimumRating) < 0 || Number(filters.minimumRating) > 5)
  ) {
    return "Minimum rating must be between 0 and 5.";
  }

  if (
    filters.maximumRating &&
    (Number(filters.maximumRating) < 0 || Number(filters.maximumRating) > 5)
  ) {
    return "Maximum rating must be between 0 and 5.";
  }

  const invalidRange = rangeChecks.find(([minimumKey, maximumKey]) => {
    const minimumValue = filters[minimumKey];
    const maximumValue = filters[maximumKey];

    return (
      minimumValue !== "" &&
      maximumValue !== "" &&
      Number(minimumValue) > Number(maximumValue)
    );
  });

  if (invalidRange) {
    return `Minimum ${invalidRange[2]} cannot be greater than maximum ${invalidRange[2]}.`;
  }

  return "";
};

export const getSearchQuery = (filters, page) => ({
  ...filters,
  page,
  // The API expects a sort order when a sort field is provided.
  sortOrder: filters.sortBy ? filters.sortOrder || "asc" : "",
});

export const getPageItems = (currentPage, lastPage) => {
  if (lastPage <= 9) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pageSet = new Set([
    1,
    2,
    lastPage - 1,
    lastPage,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const pages = Array.from(pageSet)
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((first, second) => first - second);

  return pages.flatMap((page, index) => {
    const previousPage = pages[index - 1];
    if (index > 0 && page - previousPage > 1) {
      return [`ellipsis-${previousPage}-${page}`, page];
    }

    return [page];
  });
};
