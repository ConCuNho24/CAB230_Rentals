import { Card, ListGroup } from "react-bootstrap";

import { formatRating } from "../../utils/formatters";

const PropertyDetailsCard = ({ rental }) => {
  // Data-driven rows keep the details card compact and easy to extend.
  const details = [
    ["Agency", rental.agencyName || "Not listed"],
    ["Locality", rental.locality || rental.suburb],
    ["Amenities", rental.amenities || "Not listed"],
    ["Average Rating", formatRating(rental.averageRating, rental.numRatings)],
  ];

  return (
    <Card className="app-card mb-4">
      <Card.Body>
        <h2 className="section-title">Property Details</h2>
        <ListGroup variant="flush" className="detail-list">
          {details.map(([label, value]) => (
            <ListGroup.Item key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PropertyDetailsCard;
