import { Alert, Button, Card, Table } from "react-bootstrap";

import { LoadingMessage } from "../../components/StatusMessage";
import {
  formatMoney,
  formatPropertyType,
  formatRating,
} from "../../utils/formatters";

const RentalSearchResults = ({
  errorMessage,
  isLoading,
  onLoadMore,
  onSelectRental,
  pagination,
  rentals,
}) => {
  const hasNextPage = Boolean(pagination.nextPage);

  return (
    <Card className="app-card">
      <Card.Body>
        <div className="results-toolbar">
          <div>
            <h2 className="section-title">Results</h2>
            <p className="muted-text">
              Page {pagination.currentPage || 1} of {pagination.lastPage || 1} -
              showing {rentals.length} of {pagination.total || 0} rentals
            </p>
          </div>
          {isLoading && <LoadingMessage message="Loading rentals..." />}
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
                {rentals.map((rental) => (
                  <tr key={rental.id} onClick={() => onSelectRental(rental)}>
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
                ))}
              </tbody>
            </Table>

            <div className="load-more-bar">
              {hasNextPage ? (
                <Button
                  type="button"
                  variant="outline-primary"
                  disabled={isLoading}
                  onClick={onLoadMore}
                >
                  {isLoading ? "Loading..." : "Load More Results"}
                </Button>
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
