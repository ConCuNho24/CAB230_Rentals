import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge, Container } from "react-bootstrap";

import { getPropertyTypes, getStates, searchRentals } from "../api/rentalsApi";
import { ErrorMessage } from "../components/StatusMessage";
import RentalSearchFilters from "./rentalSearch/RentalSearchFilters";
import RentalSearchResults from "./rentalSearch/RentalSearchResults";
import {
  createEmptyFilters,
  getSearchQuery,
  validateFilters,
} from "./rentalSearch/searchHelpers";
import "./RentalSearch.css";

const RentalSearch = () => {
  const [states, setStates] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [filters, setFilters] = useState(createEmptyFilters);
  const [submittedFilters, setSubmittedFilters] = useState(createEmptyFilters);
  const [visibleRentals, setVisibleRentals] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const loadRentalsPage = async (page, activeFilters, appendResults = false) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await searchRentals(getSearchQuery(activeFilters, page));
      const apiPagination = response.pagination || {};

      if (appendResults) {
        setVisibleRentals((currentRentals) => [
          ...currentRentals,
          ...(response.data || []),
        ]);
      } else {
        setVisibleRentals(response.data || []);
      }

      setPagination({
        currentPage: apiPagination.currentPage || page,
        lastPage: apiPagination.lastPage || 1,
        total: apiPagination.total || 0,
        prevPage: apiPagination.prevPage,
        nextPage: apiPagination.nextPage,
      });
    } catch (err) {
      if (!appendResults) {
        setVisibleRentals([]);
      }
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Lookup filters are loaded once and reused by the search form.
        const [stateOptions, propertyTypeOptions] = await Promise.all([
          getStates(),
          getPropertyTypes(),
        ]);

        setStates(stateOptions);
        setPropertyTypes(propertyTypeOptions);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const emptyFilters = createEmptyFilters();

    searchRentals(getSearchQuery(emptyFilters, 1))
      .then((response) => {
        const apiPagination = response.pagination || {};

        setVisibleRentals(response.data || []);
        setPagination({
          currentPage: apiPagination.currentPage || 1,
          lastPage: apiPagination.lastPage || 1,
          total: apiPagination.total || 0,
          prevPage: apiPagination.prevPage,
          nextPage: apiPagination.nextPage,
        });
      })
      .catch((err) => {
        setVisibleRentals([]);
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
    // Copy the array so submitted filters do not change while the form is edited.
    const nextFilters = { ...filters, propertyTypes: [...filters.propertyTypes] };
    const validationMessage = validateFilters(nextFilters);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setVisibleRentals([]);
    setSubmittedFilters(nextFilters);
    loadRentalsPage(1, nextFilters);
  };

  const handleReset = () => {
    const emptyFilters = createEmptyFilters();

    setFilters(emptyFilters);
    setVisibleRentals([]);
    setSubmittedFilters(emptyFilters);
    loadRentalsPage(1, emptyFilters);
  };

  const handleLoadMore = () => {
    if (!pagination.nextPage || isLoading) return;
    loadRentalsPage(pagination.nextPage, submittedFilters, true);
  };

  const handleSelectRental = (rental) => {
    navigate(`/rentals/${rental.id}`);
  };

  return (
    <Container className="page-shell">
      <div className="page-hero compact">
        <div>
          <h1 className="page-title">Rental Search</h1>
          <p className="page-subtitle">
            Search, sort and browse rentals from the full CAB230 API.
          </p>
        </div>
        <Badge bg="secondary">{pagination.total || 0} matches</Badge>
      </div>

      <RentalSearchFilters
        filters={filters}
        isLoading={isLoading}
        propertyTypes={propertyTypes}
        states={states}
        onChange={handleChange}
        onClearPropertyTypes={handleClearPropertyTypes}
        onPropertyTypeToggle={handlePropertyTypeToggle}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      <ErrorMessage message={errorMessage} />

      <RentalSearchResults
        errorMessage={errorMessage}
        isLoading={isLoading}
        pagination={pagination}
        rentals={visibleRentals}
        onLoadMore={handleLoadMore}
        onSelectRental={handleSelectRental}
      />
    </Container>
  );
};

export default RentalSearch;
