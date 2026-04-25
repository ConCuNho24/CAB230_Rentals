import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Badge,
  Button,
  Container,
  Form,
  Row,
  Col,
  Spinner,
  Card,
  Table,
} from "react-bootstrap";

import {
  searchRentals,
  getStates,
  getPropertyTypes,
} from "../api/rentalsApi";

export default function RentalSearch() {
  const [rentals, setRentals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [states, setStates] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [filters, setFilters] = useState({
    state: "",
    propertyType: "",
    postcode: "",
    suburb: "",
    minimumRent: "",
    maximumRent: "",
    minimumBedrooms: "",
    minimumBathrooms: "",
    minimumParking: "",
    minimumRating: "",
    sortBy: "",
    sortOrder: "",
  });

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadOptions() {
      try {
        setStates(await getStates());
        setPropertyTypes(await getPropertyTypes());
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    loadRentals(page);
  }, [page]);

  async function loadRentals(pageNumber = 1) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await searchRentals({
        page: pageNumber,
        state: filters.state,
        postcode: filters.postcode,
        suburb: filters.suburb,
        propertyTypes: filters.propertyType,
        minimumRent: filters.minimumRent,
        maximumRent: filters.maximumRent,
        minimumBedrooms: filters.minimumBedrooms,
        minimumBathrooms: filters.minimumBathrooms,
        minimumParking: filters.minimumParking,
        minimumRating: filters.minimumRating,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setRentals(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    loadRentals(1);
  }

  function handleReset() {
    setFilters({
      state: "",
      propertyType: "",
      postcode: "",
      suburb: "",
      minimumRent: "",
      maximumRent: "",
      minimumBedrooms: "",
      minimumBathrooms: "",
      minimumParking: "",
      minimumRating: "",
      sortBy: "",
      sortOrder: "",
    });

    setPage(1);
    loadRentals(1);
  }

  return (
    <Container className="mt-4 page-shell">
      <div className="page-hero">
        <h1 className="page-title">Rental Search</h1>
        <p className="page-subtitle">
          Find rental properties across Australia
        </p>
      </div>

      {/* SEARCH */}
      <Card className="search-panel">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md={2}>
                <Form.Label>State</Form.Label>
                <Form.Select name="state" value={filters.state} onChange={handleChange}>
                  <option value="">Any</option>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label>Property Type</Form.Label>
                <Form.Select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Any</option>
                  {propertyTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  name="postcode"
                  value={filters.postcode}
                  onChange={handleChange}
                />
              </Col>

              <Col md={2}>
                <Form.Label>Suburb</Form.Label>
                <Form.Control
                  name="suburb"
                  value={filters.suburb}
                  onChange={handleChange}
                  placeholder="e.g. Brisbane"
                />
              </Col>

              <Col md={2}>
                <Form.Label>Min Rent</Form.Label>
                <Form.Control
                  type="number"
                  name="minimumRent"
                  value={filters.minimumRent}
                  onChange={handleChange}
                  min="0"
                />
              </Col>

              <Col md={2}>
                <Form.Label>Max Rent</Form.Label>
                <Form.Control
                  type="number"
                  name="maximumRent"
                  value={filters.maximumRent}
                  onChange={handleChange}
                  min="0"
                />
              </Col>

              <Col md={2}>
                <Form.Label>Min Parking</Form.Label>
                <Form.Control
                  type="number"
                  name="minimumParking"
                  value={filters.minimumParking}
                  onChange={handleChange}
                  min="0"
                />
              </Col>

              <Col md={2}>
                <Form.Label>Min Rating</Form.Label>
                <Form.Select
                  name="minimumRating"
                  value={filters.minimumRating}
                  onChange={handleChange}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleChange}
                >
                  <option value="">Default</option>
                  <option value="rent">Rent</option>
                  <option value="bedrooms">Bedrooms</option>
                  <option value="bathrooms">Bathrooms</option>
                  <option value="parkingSpaces">Parking</option>
                  <option value="averageRating">Rating</option>
                  <option value="title">Title</option>
                  <option value="suburb">Suburb</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label>Sort Order</Form.Label>
                <Form.Select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleChange}
                  disabled={!filters.sortBy}
                >
                  <option value="">Default</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label>Min Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="minimumBedrooms"
                  value={filters.minimumBedrooms}
                  onChange={handleChange}
                />
              </Col>

              <Col md={2}>
                <Form.Label>Min Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  name="minimumBathrooms"
                  value={filters.minimumBathrooms}
                  onChange={handleChange}
                />
              </Col>

              <Col md={1}>
                <Button type="submit">Search</Button>
              </Col>

              <Col md={1}>
                <Button variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* RESULTS */}
      <Card className="results-card">
        <Card.Body>
          <div className="results-toolbar">
            <div>
              <h5>Results</h5>
              <Badge bg="success">{pagination.total || 0}</Badge> rentals
            </div>
            <Badge bg="secondary">
              Page {pagination.currentPage || 1} / {pagination.lastPage || 1}
            </Badge>
          </div>

          {isLoading && (
            <Spinner animation="border" />
          )}

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {!isLoading && (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Rent</th>
                  <th>Type</th>
                  <th>Suburb</th>
                  <th>State</th>
                  <th>Bed</th>
                  <th>Bath</th>
                  <th>Parking</th>
                </tr>
              </thead>

              <tbody>
                {rentals.map((r) => (
                  <tr
                    key={r.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/rentals/${r.id}`)}
                  >
                    <td>{r.title}</td>
                    <td>${r.rent}</td>
                    <td>{r.propertyType}</td>
                    <td>{r.suburb}</td>
                    <td>{r.state}</td>
                    <td>{r.bedrooms}</td>
                    <td>{r.bathrooms}</td>
                    <td>{r.parkingSpaces}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* PAGINATION */}
      <div className="pagination-bar">
        <Button
          disabled={!pagination.prevPage}
          onClick={() => setPage(pagination.prevPage)}
        >
          Previous
        </Button>

        <span className="page-indicator">
          Page {pagination.currentPage || 1}
        </span>

        <Button
          disabled={!pagination.nextPage}
          onClick={() => setPage(pagination.nextPage)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}