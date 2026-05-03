import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { getRentalById } from "../api/rentalsApi";
import { getMyRatings } from "../api/ratingsApi";
import PageHeader from "../components/PageHeader";
import {
  RentalFactsCells,
  RentalTitleCell,
} from "../components/results/RentalTableCells";
import { ratedRentalColumns } from "../components/results/resultColumns";
import ResultsTable from "../components/results/ResultsTable";
import { ErrorMessage } from "../components/StatusMessage";
import { formatDateTime, formatUserRating } from "../utils/formatters";
import "./RatedRentals.css";

const RatedRentals = () => {
  const [ratings, setRatings] = useState([]);
  const [rentalsById, setRentalsById] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const rows = ratings.map((rating) => ({
    ...rating,
    rental: rentalsById[rating.rentalId],
  }));

  const getRentalsByRatingIds = async (nextRatings) => {
    const rentalIds = [
      ...new Set(nextRatings.map((rating) => rating.rentalId)),
    ];

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

    return Object.fromEntries(rentalResults);
  };

  const loadRatedRentalsPage = async (page, appendResults = false) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const ratingResponse = await getMyRatings(page);
      const nextRatings = ratingResponse.data || [];
      const apiPagination = ratingResponse.pagination || {};
      const nextRentalsById = await getRentalsByRatingIds(nextRatings);

      setRatings((currentRatings) =>
        appendResults ? [...currentRatings, ...nextRatings] : nextRatings,
      );
      setRentalsById((currentRentalsById) => ({
        ...currentRentalsById,
        ...nextRentalsById,
      }));
      setPagination({
        currentPage: apiPagination.currentPage || page,
        lastPage: apiPagination.lastPage || 1,
        total: apiPagination.total || nextRatings.length,
        prevPage: apiPagination.prevPage,
        nextPage: apiPagination.nextPage,
      });
    } catch (err) {
      if (!appendResults) {
        setRatings([]);
      }

      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyRatings(1)
      .then(async (ratingResponse) => {
        const nextRatings = ratingResponse.data || [];
        const nextRentalsById = await getRentalsByRatingIds(nextRatings);
        const apiPagination = ratingResponse.pagination || {};

        setRatings(nextRatings);
        setRentalsById(nextRentalsById);
        setPagination({
          currentPage: apiPagination.currentPage || 1,
          lastPage: apiPagination.lastPage || 1,
          total: apiPagination.total || nextRatings.length,
          prevPage: apiPagination.prevPage,
          nextPage: apiPagination.nextPage,
        });
      })
      .catch((err) => {
        setRatings([]);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    if (!pagination.nextPage || isLoading) return;
    loadRatedRentalsPage(pagination.nextPage, true);
  };

  return (
    <Container className="page-shell rated-rentals-page">
      <PageHeader
        title="Rated Rentals"
        subtitle="Review the properties you have rated while logged in."
        badgeText={`${pagination.total || rows.length || 0} total`}
      />

      <ErrorMessage message={errorMessage} />

      <ResultsTable
        columns={ratedRentalColumns}
        emptyMessage="You have not rated any rentals yet."
        errorMessage={errorMessage}
        getRowKey={({ rentalId, dateTime }) => `${rentalId}-${dateTime}`}
        hasNextPage={Boolean(pagination.nextPage)}
        isLoading={isLoading}
        loadingMessage="Loading rated rentals..."
        onLoadMore={handleLoadMore}
        rows={rows}
        total={pagination.total || rows.length || 0}
        renderRow={({ rental, rating, rentalId, dateTime }) => (
          <tr onClick={() => navigate(`/rentals/${rentalId}`)}>
            <RentalTitleCell rental={rental} fallback={`Rental ${rentalId}`} />
            <td className="rated-rating-column">{formatUserRating(rating)}</td>
            <td className="rated-date-column">{formatDateTime(dateTime)}</td>
            <RentalFactsCells rental={rental} />
          </tr>
        )}
      />
    </Container>
  );
};

export default RatedRentals;
