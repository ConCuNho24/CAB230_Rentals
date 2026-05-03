import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";

import { getRentalById, searchRentals } from "../api/rentalsApi";
import { getMyRatingForRental, rateRental } from "../api/ratingsApi";
import RentalMap from "../components/RentalMap";
import { ErrorMessage, LoadingMessage } from "../components/StatusMessage";
import { useAuth } from "../context/authStore";
import PropertyDetailsCard from "./rentalDetail/PropertyDetailsCard";
import RatingCard from "./rentalDetail/RatingCard";
import RentalOverview from "./rentalDetail/RentalOverview";
import "./RentalDetail.css";

const RentalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [rental, setRental] = useState(null);
  const [nearbyRentals, setNearbyRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [myRating, setMyRating] = useState("");
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const rentalId = Number(id);

  const rentalForMap = rental ? { ...rental, id: rentalId } : null;
  const mapRentals = rentalForMap
    ? [rentalForMap, ...nearbyRentals.filter((item) => item.id !== rentalId)].slice(
        0,
        10,
      )
    : nearbyRentals.slice(0, 10);

  useEffect(() => {
    const loadRental = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const rentalData = await getRentalById(rentalId);
        setRental(rentalData);

        // Nearby rentals give the detail map useful local context.
        const nearbyData = await searchRentals({
          postcode: rentalData.postcode,
          page: 1,
        });
        setNearbyRentals(nearbyData.data || []);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRental();
  }, [rentalId]);

  useEffect(() => {
    const loadMyRating = async () => {
      if (!isAuthenticated) {
        setMyRating("");
        return;
      }

      try {
        const data = await getMyRatingForRental(rentalId);
        setMyRating(String(data.rating));
      } catch (err) {
        if (err.status === 404) {
          // A 404 here only means the logged-in user has not rated this rental yet.
          setMyRating("");
          return;
        }

        setRatingError(err.message);
      }
    };

    loadMyRating();
  }, [isAuthenticated, rentalId]);

  const handleSubmitRating = async (event) => {
    event.preventDefault();

    try {
      setIsSubmittingRating(true);
      setRatingError("");
      setRatingMessage("");

      await rateRental(rentalId, Number(myRating));
      setRatingMessage("Rating submitted successfully.");

      // Reload the rental so the average rating and count are current.
      const updatedRental = await getRentalById(rentalId);
      setRental(updatedRental);
    } catch (err) {
      setRatingError(err.message);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="page-shell">
        <LoadingMessage message="Loading rental details..." />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container className="page-shell">
        <ErrorMessage message={errorMessage} />
        <Button as={Link} to="/rentals" variant="outline-primary">
          Back to Search
        </Button>
      </Container>
    );
  }

  if (!rental) {
    return (
      <Container className="page-shell">
        <Alert variant="info">No rental found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="page-shell">
      <div className="detail-toolbar">
        <Button as={Link} to="/rentals" variant="outline-primary" size="sm">
          &larr; Back to Search
        </Button>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <RentalOverview rental={rental} />
        </Col>

        <Col lg={5}>
          <PropertyDetailsCard rental={rental} />

          <RatingCard
            error={ratingError}
            isAuthenticated={isAuthenticated}
            isSubmitting={isSubmittingRating}
            message={ratingMessage}
            onRatingChange={setMyRating}
            onSubmit={handleSubmitRating}
            rating={myRating}
            rentalId={rentalId}
          />
        </Col>
      </Row>

      <Card className="app-card mt-4">
        <Card.Body>
          <div className="section-heading-row">
            <div>
              <h2 className="section-title">Location</h2>
              <p className="muted-text">
                This map includes the selected rental and nearby rentals in the
                same postcode when available.
              </p>
            </div>
            <Badge bg="light" text="dark">
              {mapRentals.length} markers
            </Badge>
          </div>

          <RentalMap
            activeRentalId={rentalId}
            rentals={mapRentals}
            zoom={13}
            height={420}
            onSelectRental={(selectedRental) =>
              navigate(`/rentals/${selectedRental.id}`)
            }
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RentalDetail;
