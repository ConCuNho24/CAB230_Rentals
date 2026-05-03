import { Badge, Card, Col, Row } from "react-bootstrap";

import {
  cleanDescription,
  formatMoney,
  formatPropertyType,
} from "../../utils/formatters";

const metrics = [
  ["rent", "Rent", formatMoney],
  ["bedrooms", "Bedrooms"],
  ["bathrooms", "Bathrooms"],
  ["parkingSpaces", "Parking"],
];

const RentalOverview = ({ rental }) => {
  // API descriptions can contain simple HTML, so render cleaned text paragraphs.
  const descriptionLines = cleanDescription(rental.description);

  return (
    <Card className="app-card">
      <Card.Body>
        <div className="detail-heading">
          <div>
            <h1>{rental.title}</h1>
            <p>
              {rental.streetAddress}, {rental.suburb}, {rental.state}{" "}
              {rental.postcode}
            </p>
          </div>
          <Badge bg="secondary">{formatPropertyType(rental.propertyType)}</Badge>
        </div>

        <Row className="metric-row g-3">
          {metrics.map(([key, label, formatValue]) => (
            <Col sm={3} key={key}>
              <div className="metric-box">
                <span>{label}</span>
                <strong>{formatValue ? formatValue(rental[key]) : rental[key]}</strong>
              </div>
            </Col>
          ))}
        </Row>

        <h2 className="section-title">Description</h2>
        <div className="description">
          {descriptionLines.length > 0 ? (
            descriptionLines.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RentalOverview;
