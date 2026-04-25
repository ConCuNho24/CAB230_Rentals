import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Map, Marker } from "pigeon-maps";

import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap";

import { getRentalById } from "../api/rentalsApi";
import { getMyRatingForRental, rateRental } from "../api/ratingsApi";

export default function RentalDetail() {
  const { id } = useParams();

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [myRating, setMyRating] = useState("");
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingError, setRatingError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadRental() {
      try {
        setLoading(true);
        setError("");

        const data = await getRentalById(id);
        setRental(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRental();
  }, [id]);

  useEffect(() => {
    async function loadMyRating() {
      if (!token) return;

      try {
        const data = await getMyRatingForRental(id);

        if (data.rating) {
          setMyRating(String(data.rating));
        }
      } catch {
        // Nếu user chưa từng rating property này thì bỏ qua.
      }
    }

    loadMyRating();
  }, [id, token]);

  async function handleSubmitRating(event) {
    event.preventDefault();

    try {
      setRatingError("");
      setRatingMessage("");

      await rateRental(id, Number(myRating));

      setRatingMessage("Rating submitted successfully.");

      const updatedRental = await getRentalById(id);
      setRental(updatedRental);
    } catch (err) {
      setRatingError(err.message);
    }
  }

  if (loading) return <p>Loading rental details...</p>;
  if (error) return <p className="text-danger fw-bold">{error}</p>;
  if (!rental) return <p>No rental found.</p>;

  return (
    <Container className="mt-4">
      <Button as={Link} to="/rentals" variant="outline-primary" size="sm">
        ← Back to Rental Search
      </Button>

      <Card className="mt-3 shadow-sm">
        <Card.Body>
          <Card.Title as="h1">{rental.title}</Card.Title>

          <div className="mb-3">
            <Badge bg="secondary" className="me-2">
              {rental.propertyType}
            </Badge>

            <Badge bg="info">
              {rental.suburb}, {rental.state}
            </Badge>
          </div>

          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Weekly Rent:</strong> $
                  {rental.rent?.toLocaleString()}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Address:</strong> {rental.streetAddress}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Postcode:</strong> {rental.postcode}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Agency:</strong> {rental.agencyName}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Bedrooms:</strong> {rental.bedrooms}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Bathrooms:</strong> {rental.bathrooms}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Parking Spaces:</strong> {rental.parkingSpaces}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Average Rating:</strong>{" "}
                  {rental.averageRating
                    ? `${rental.averageRating} stars (${rental.numRatings})`
                    : "No ratings yet"}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <h2 className="mt-4">Your Rating</h2>

          {!token ? (
            <Alert variant="warning">
              Please log in to rate this rental.
            </Alert>
          ) : (
            <Form onSubmit={handleSubmitRating} className="mb-3">
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <Form.Label>Select rating</Form.Label>
                  <Form.Select
                    value={myRating}
                    onChange={(e) => setMyRating(e.target.value)}
                    required
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 star</option>
                    <option value="2">2 stars</option>
                    <option value="3">3 stars</option>
                    <option value="4">4 stars</option>
                    <option value="5">5 stars</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Button type="submit" disabled={!myRating}>
                    Submit Rating
                  </Button>
                </Col>
              </Row>
            </Form>
          )}

          {ratingMessage && <Alert variant="success">{ratingMessage}</Alert>}
          {ratingError && <Alert variant="danger">{ratingError}</Alert>}

          <h2 className="mt-4">Description</h2>

          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: rental.description }}
          />

          <h2 className="mt-4">Location Map</h2>

          <div className="map-container">
            <Map
              height={400}
              defaultCenter={[rental.latitude, rental.longitude]}
              defaultZoom={14}
            >
              <Marker width={40} anchor={[rental.latitude, rental.longitude]} />
            </Map>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}