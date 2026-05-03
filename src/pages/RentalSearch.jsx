import { useNavigate } from "react-router-dom";

import { Badge, Container } from "react-bootstrap";

import { ErrorMessage } from "../components/StatusMessage";
import RentalSearchFilters from "./rentalSearch/RentalSearchFilters";
import RentalSearchResults from "./rentalSearch/RentalSearchResults";
import { useRentalSearch } from "./rentalSearch/useRentalSearch";
import "./RentalSearch.css";

const RentalSearch = () => {
  const navigate = useNavigate();
  const {
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
  } = useRentalSearch();

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
        rentals={rentals}
        onLoadMore={handleLoadMore}
        onSelectRental={handleSelectRental}
      />
    </Container>
  );
};

export default RentalSearch;
