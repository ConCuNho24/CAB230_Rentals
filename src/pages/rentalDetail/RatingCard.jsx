import { Alert, Button, ButtonGroup, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const ratingValues = [1, 2, 3, 4, 5];

// Presentation-only rating panel; RentalDetail owns the API submit logic.
const RatingCard = ({
  isAuthenticated,
  isSubmitting,
  message,
  onRatingChange,
  onSubmit,
  rating,
  rentalId,
  error,
}) => (
  <Card className="app-card">
    <Card.Body>
      <h2 className="section-title">Your Rating</h2>

      {!isAuthenticated ? (
        <Alert variant="warning">
          <Link to="/login" state={{ from: `/rentals/${rentalId}` }}>
            Log in
          </Link>{" "}
          to rate this rental.
        </Alert>
      ) : (
        <Form onSubmit={onSubmit}>
          <ButtonGroup className="rating-buttons" aria-label="Rating">
            {ratingValues.map((ratingValue) => (
              <Button
                key={ratingValue}
                type="button"
                variant={rating === String(ratingValue) ? "primary" : "outline-primary"}
                onClick={() => onRatingChange(String(ratingValue))}
              >
                {ratingValue}
              </Button>
            ))}
          </ButtonGroup>

          <Button
            type="submit"
            disabled={!rating || isSubmitting}
            className="mt-3 w-100"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </Form>
      )}

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </Card.Body>
  </Card>
);

export default RatingCard;
