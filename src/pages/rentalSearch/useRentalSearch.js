import { useEffect, useState } from "react";

import { getPropertyTypes, getStates, searchRentals } from "../../api/rentalsApi";
import {
  createEmptyFilters,
  getSearchQuery,
  validateFilters,
} from "./searchHelpers";

const defaultPagination = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
};

const getPagination = (apiPagination = {}, page = 1) => ({
  currentPage: apiPagination.currentPage || page,
  lastPage: apiPagination.lastPage || 1,
  total: apiPagination.total || 0,
  prevPage: apiPagination.prevPage,
  nextPage: apiPagination.nextPage,
});

export const useRentalSearch = () => {
  const [states, setStates] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [filters, setFilters] = useState(createEmptyFilters);
  const [submittedFilters, setSubmittedFilters] = useState(createEmptyFilters);
  const [rentals, setRentals] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const applySearchResponse = (response, page, appendResults) => {
    if (appendResults) {
      setRentals((currentRentals) => [
        ...currentRentals,
        ...(response.data || []),
      ]);
    } else {
      setRentals(response.data || []);
    }

    setPagination(getPagination(response.pagination, page));
  };

  const loadRentalsPage = async (page, activeFilters, appendResults = false) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await searchRentals(getSearchQuery(activeFilters, page));
      applySearchResponse(response, page, appendResults);
    } catch (err) {
      if (!appendResults) {
        setRentals([]);
      }

      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getStates(), getPropertyTypes()])
      .then(([stateOptions, propertyTypeOptions]) => {
        setStates(stateOptions);
        setPropertyTypes(propertyTypeOptions);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }, []);

  useEffect(() => {
    const emptyFilters = createEmptyFilters();

    searchRentals(getSearchQuery(emptyFilters, 1))
      .then((response) => {
        applySearchResponse(response, 1, false);
      })
      .catch((err) => {
        setRentals([]);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      ...(name === "sortBy" && value === "" ? { sortOrder: "" } : {}),
    }));
  };

  const handlePropertyTypeToggle = (propertyType) => {
    setFilters((currentFilters) => {
      const selectedTypes = currentFilters.propertyTypes.includes(propertyType)
        ? currentFilters.propertyTypes.filter((item) => item !== propertyType)
        : [...currentFilters.propertyTypes, propertyType];

      return {
        ...currentFilters,
        propertyTypes: selectedTypes,
      };
    });
  };

  const handleClearPropertyTypes = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      propertyTypes: [],
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const nextFilters = { ...filters, propertyTypes: [...filters.propertyTypes] };
    const validationMessage = validateFilters(nextFilters);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setRentals([]);
    setSubmittedFilters(nextFilters);
    loadRentalsPage(1, nextFilters);
  };

  const handleReset = () => {
    const emptyFilters = createEmptyFilters();

    setFilters(emptyFilters);
    setRentals([]);
    setSubmittedFilters(emptyFilters);
    loadRentalsPage(1, emptyFilters);
  };

  const handleLoadMore = () => {
    if (!pagination.nextPage || isLoading) return;
    loadRentalsPage(pagination.nextPage, submittedFilters, true);
  };

  return {
    errorMessage,
    filters,
    handleChange,
    handleClearPropertyTypes,
    handleLoadMore,
    handlePropertyTypeToggle,
    handleReset,
    handleSearch,
    isLoading,
    pagination,
    propertyTypes,
    rentals,
    states,
  };
};
