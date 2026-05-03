import { Link } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";

import homeBackground from "../assets/HomeBackGround.png";
import "./Home.css";

const homeFeatures = [
  {
    title: "Find the Right Rental",
    description:
      "Search by suburb, state, postcode, property type, rent range, bedrooms, bathrooms and parking.",
  },
  {
    title: "Compare Property Details",
    description:
      "Review rent, amenities, agency details, rating history and nearby properties before you inspect.",
  },
  {
    title: "Save Your Impressions",
    description:
      "Create an account, rate homes you have viewed and revisit your rental shortlist anytime.",
  },
];

const marketStats = [
  ["6,700+", "rental listings"],
  ["8", "states and territories"],
  ["10", "results loaded at a time"],
  ["Member", "ratings and shortlist history"],
];

const renterSteps = [
  {
    title: "Search your preferred area",
    description:
      "Start broad with state and suburb, then narrow results by budget, property type and household needs.",
  },
  {
    title: "Compare real property signals",
    description:
      "Scan rent, bedrooms, bathrooms, parking, average rating and agency details before opening a listing.",
  },
  {
    title: "Keep track as you inspect",
    description:
      "Rate homes after viewings and return to your reviewed rentals when it is time to make a decision.",
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
            Rentals across Australia
          </Badge>
          <h1>Find Your Next Rental Home</h1>
          <p>
            Browse available homes, compare key property details and keep track
            of the rentals that feel right for your next move.
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

      <section className="home-info-band">
        <div className="home-section-heading">
          <span>Rental search made practical</span>
          <h2>Everything you need to shortlist with confidence</h2>
        </div>

        <Row className="g-3 home-stat-row">
          {marketStats.map(([value, label]) => (
            <Col lg={3} sm={6} key={label}>
              <div className="home-stat">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <section className="home-process-section">
        <Row className="g-4 align-items-stretch">
          <Col lg={5}>
            <div className="home-process-copy">
              <span>For renters</span>
              <h2>Move from browsing to a clear shortlist</h2>
              <p>
                RENFIN is built around repeated rental decisions: quick filters,
                readable comparison tables, detailed property pages and a review
                history that stays with your account.
              </p>
              <Button as={Link} to="/rentals" variant="outline-light">
                Start Searching
              </Button>
            </div>
          </Col>

          <Col lg={7}>
            <div className="home-step-list">
              {renterSteps.map((step, index) => (
                <div className="home-step" key={step.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      <section className="home-final-cta">
        <div>
          <span>Ready when you are</span>
          <h2>Search, compare and rate your next rental home.</h2>
        </div>
        <Button as={Link} to="/rentals" size="lg">
          Browse Rentals
        </Button>
      </section>
    </Container>
  </div>
);

export default Home;
