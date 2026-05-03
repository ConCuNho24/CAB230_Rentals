import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Badge, Card, Container, Table } from "react-bootstrap";

import { getRentalById } from "../api/rentalsApi";
import { getMyRatings } from "../api/ratingsApi";
import PaginationControls from "../components/PaginationControls";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";
import {
  formatDateTime,
  formatMoney,
  formatPropertyType,
  formatUserRating,
} from "../utils/formatters";
import { getPageItems, PAGE_SIZE } from "./rentalSearch/searchHelpers";
import "./RatedRentals.css";

const RatedRentals = () => {
  const [ratings, setRatings] = useState([]);
  const [rentalsById, setRentalsById] = useState({});
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const rows = ratings.map((rating) => ({
    ...rating,
    rental: rentalsById[rating.rentalId],
  }));
  const lastPage = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, lastPage);
  const firstRowIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = rows.slice(firstRowIndex, firstRowIndex + PAGE_SIZE);
  const paginationItems = getPageItems(
    currentPage,
    lastPage,
  );

  useEffect(() => {
    const loadRatedRentals = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const ratingResponse = await getMyRatings();
        const nextRatings = ratingResponse.data || [];
        setRatings(nextRatings);
        setPagination({
          total: nextRatings.length,
        });

        const rentalIds = [...new Set(nextRatings.map((rating) => rating.rentalId))];
        const rentalResults = await Promise.all(
          rentalIds.map(async (rentalId) => {
            try {
              const rental = await getRentalById(rentalId);
              return [rentalId, rental];
            } catch {
              return [rentalId, null];
            }
          }),
        );

        setRentalsById(Object.fromEntries(rentalResults));
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRatedRentals();
  }, []);

  const handlePageChange = (nextPage) => {
    if (nextPage === currentPage || isLoading) return;
    setPage(nextPage);
  };

  return (
    <Container className="page-shell rated-rentals-page">
      <div className="page-hero compact">
        <div>
          <h1 className="page-title">Rated Rentals</h1>
          <p className="page-subtitle">
            Review the properties you have rated while logged in.
          </p>
        </div>
        <Badge bg="secondary">{rows.length || pagination.total || 0} total</Badge>
      </div>

      <Card className="app-card">
        <Card.Body>
          <ErrorMessage message={errorMessage} />
          {isLoading && <LoadingMessage message="Loading rated rentals..." />}

          {!isLoading && !errorMessage && visibleRows.length === 0 && (
            <Alert variant="info">You have not rated any rentals yet.</Alert>
          )}

          {!isLoading && visibleRows.length > 0 && (
            <Table hover className="rentals-table align-middle">
              <thead>
                <tr>
                  <th className="rental-title-column">Title</th>
                  <th>Your Rating</th>
                  <th>Rated</th>
                  <th>Rent</th>
                  <th>Type</th>
                  <th>Suburb</th>
                  <th>State</th>
                  <th>Bed</th>
                  <th>Bath</th>
                  <th>Parking</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(({ rental, rating, rentalId, dateTime }) => (
                  <tr
                    key={`${rentalId}-${dateTime}`}
                    onClick={() => navigate(`/rentals/${rentalId}`)}
                  >
                    <td className="rental-title-column">
                      {rental?.title || `Rental ${rentalId}`}
                    </td>
                    <td>{formatUserRating(rating)}</td>
                    <td>{formatDateTime(dateTime)}</td>
                    <td>{rental ? formatMoney(rental.rent) : "Unavailable"}</td>
                    <td>
                      {rental ? formatPropertyType(rental.propertyType) : "Unavailable"}
                    </td>
                    <td>{rental?.suburb || "Unavailable"}</td>
                    <td>{rental?.state || "Unavailable"}</td>
                    <td>{rental?.bedrooms ?? "Unavailable"}</td>
                    <td>{rental?.bathrooms ?? "Unavailable"}</td>
                    <td>{rental?.parkingSpaces ?? "Unavailable"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <PaginationControls
        currentPage={currentPage}
        items={paginationItems}
        isLoading={isLoading}
        lastPage={lastPage}
        nextPage={currentPage < lastPage ? currentPage + 1 : null}
        onPageChange={handlePageChange}
        prevPage={currentPage > 1 ? currentPage - 1 : null}
      />
    </Container>
  );
};

export default RatedRentals;
