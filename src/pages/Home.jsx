import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";

import homeBackground from "../assets/HomeBackGround.png";
import "./Home.css";

const homeFeatures = [
  {
    title: "Complete Rental Search",
    description:
      "Filter by state, suburb, postcode, property type, rent, bedrooms, bathrooms, parking and ratings.",
  },
  {
    title: "Mapped Property Detail",
    description:
      "Inspect location, agency, amenities, rating history and nearby rentals before opening a property link.",
  },
  {
    title: "Member Ratings",
    description:
      "Register, log in, rate rentals and return to the properties you have reviewed.",
  },
];

const Home = () => (
  <div className="home-page">
    <div
      className="home-background"
      style={{ backgroundImage: `url(${homeBackground})` }}
    />

    <Container className="home-content">
      <section className="home-hero">
        <div className="home-hero-copy">
          <Badge bg="light" text="dark" className="mb-3">
            Australian rental market 2026
          </Badge>
          <h1>Australian Rental Search</h1>
          <p>
            Explore rental properties through the CAB230 REST API with routed
            search, map views, authentication and ratings.
          </p>
          <div className="hero-actions">
            <Button as={Link} to="/rentals" size="lg">
              Search Rentals
            </Button>
            <Button as={Link} to="/register" variant="outline-light" size="lg">
              Create Account
            </Button>
          </div>
        </div>
      </section>

      <Row className="g-4 mt-1 home-feature-row">
        {homeFeatures.map((feature) => (
          <Col lg={4} key={feature.title}>
            <Card className="app-card home-feature-card h-100">
              <Card.Body>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text>{feature.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </div>
);

export default Home;
