import { Fragment, useEffect, useRef } from "react";

import { Alert, Card, Table } from "react-bootstrap";

import { LoadingMessage } from "../../components/StatusMessage";
import {
  formatMoney,
  formatPropertyType,
  formatRating,
} from "../../utils/formatters";
import { PAGE_SIZE } from "./searchHelpers";
import "./RentalSearchResults.css";

const RentalSearchResults = ({
  errorMessage,
  isLoading,
  onLoadMore,
  onSelectRental,
  pagination,
  rentals,
}) => {
  const loadMoreRef = useRef(null);
  const hasNextPage = Boolean(pagination.nextPage);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasNextPage) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        onLoadMore();
      }
    });

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, onLoadMore]);

  return (
    <Card className="app-card">
      <Card.Body>
        <div className="results-toolbar">
          <div>
            <h2 className="section-title">Results</h2>
          </div>
          {isLoading && rentals.length === 0 && (
            <LoadingMessage message="Loading rentals..." />
          )}
        </div>

        {pagination.total === 0 && !isLoading && !errorMessage && (
          <Alert variant="info">No rentals match this search.</Alert>
        )}

        {rentals.length > 0 && (
          <>
            <Table hover className="rentals-table align-middle">
              <thead>
                <tr>
                  <th className="rental-title-column">Title</th>
                  <th>Rent</th>
                  <th>Type</th>
                  <th>Suburb</th>
                  <th>State</th>
                  <th>Postcode</th>
                  <th>Bed</th>
                  <th>Bath</th>
                  <th>Park</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental, index) => {
                  const pageNumber = Math.floor(index / PAGE_SIZE) + 1;
                  const firstResultNumber = index + 1;
                  const lastResultNumber = Math.min(
                    pageNumber * PAGE_SIZE,
                    pagination.total || rentals.length,
                  );
                  const showDivider = index > 0 && index % PAGE_SIZE === 0;

                  return (
                    <Fragment key={rental.id}>
                      {showDivider && (
                        <tr className="results-divider-row">
                          <td colSpan="10">
                            <span>
                              Results {firstResultNumber} to {lastResultNumber}
                            </span>
                          </td>
                        </tr>
                      )}

                      <tr onClick={() => onSelectRental(rental)}>
                        <td className="rental-title-column">{rental.title}</td>
                        <td>{formatMoney(rental.rent)}</td>
                        <td>{formatPropertyType(rental.propertyType)}</td>
                        <td>{rental.suburb}</td>
                        <td>{rental.state}</td>
                        <td>{rental.postcode}</td>
                        <td>{rental.bedrooms}</td>
                        <td>{rental.bathrooms}</td>
                        <td>{rental.parkingSpaces}</td>
                        <td>{formatRating(rental.averageRating, rental.numRatings)}</td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </Table>

            <div ref={loadMoreRef} className="load-more-bar">
              {hasNextPage ? (
                <span>{isLoading ? "Loading More Results ..." : ""}</span>
              ) : (
                <span>End of results</span>
              )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default RentalSearchResults;
