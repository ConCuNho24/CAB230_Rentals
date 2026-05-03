import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";

import PropertyTypesDropdown from "./PropertyTypesDropdown";
import { numberFilters, sortOptions } from "./searchHelpers";

const RentalSearchFilters = ({
  filters,
  isLoading,
  onChange,
  onClearPropertyTypes,
  onPropertyTypeToggle,
  onReset,
  onSearch,
  propertyTypes,
  states,
}) => (
  <Card className="app-card search-panel">
    <Card.Body>
      <Form onSubmit={onSearch}>
        <Row className="g-3 align-items-end">
          <Col xl={3} lg={4} md={6}>
            <Form.Label>Suburb</Form.Label>
            <Form.Control
              name="suburb"
              value={filters.suburb}
              onChange={onChange}
              placeholder="e.g. Sydney"
            />
          </Col>

          <Col xl={2} lg={3} md={6}>
            <Form.Label>State</Form.Label>
            <Form.Select name="state" value={filters.state} onChange={onChange}>
              <option value="">Any</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xl={2} lg={3} md={6}>
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              name="postcode"
              type="number"
              min="0"
              max="9999"
              value={filters.postcode}
              onChange={onChange}
            />
          </Col>

          <Col xl={3} lg={4} md={6}>
            <Form.Label>Property Types</Form.Label>
            <PropertyTypesDropdown
              propertyTypes={propertyTypes}
              selectedPropertyTypes={filters.propertyTypes}
              onToggle={onPropertyTypeToggle}
              onClear={onClearPropertyTypes}
            />
          </Col>

          <Col xl={2} lg={4} md={12}>
            <div className="button-stack">
              <Button type="submit" disabled={isLoading}>
                Search
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </Col>
        </Row>

        <Accordion className="mt-3" alwaysOpen>
          <Accordion.Item eventKey="advanced">
            <Accordion.Header>Advanced Search</Accordion.Header>
            <Accordion.Body>
              <Row className="g-3">
                {numberFilters.map(([name, label]) => (
                  <Col xl={2} lg={3} md={4} sm={6} key={name}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      name={name}
                      type="number"
                      min="0"
                      max={name.includes("Rating") ? "5" : undefined}
                      step={name.includes("Rating") ? "0.1" : "1"}
                      value={filters[name]}
                      onChange={onChange}
                    />
                  </Col>
                ))}

                <Col xl={3} lg={4} md={6}>
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={onChange}
                  >
                    {sortOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col xl={3} lg={4} md={6}>
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={onChange}
                    disabled={!filters.sortBy}
                  >
                    <option value="">Default Ascending</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </Form.Select>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </Card.Body>
  </Card>
);

export default RentalSearchFilters;
