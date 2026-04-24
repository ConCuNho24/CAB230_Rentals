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
    minimumBedrooms: "",
    minimumBathrooms: "",
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
        propertyTypes: filters.propertyType,
        minimumBedrooms: filters.minimumBedrooms,
        minimumBathrooms: filters.minimumBathrooms,
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
      minimumBedrooms: "",
      minimumBathrooms: "",
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