import { useNavigate } from "react-router-dom";

import { Container } from "react-bootstrap";

import PageHeader from "../components/PageHeader";
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
      <PageHeader
        title="Rental Search"
        subtitle="Search, sort and browse available rental properties."
        badgeText={`${pagination.total || 0} matches`}
      />

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
