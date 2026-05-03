import { Button, Dropdown, Form } from "react-bootstrap";

import { formatPropertyType } from "../../utils/formatters";
import "./PropertyTypesDropdown.css";

const getPropertyTypeLabel = (selectedPropertyTypes) => {
  if (selectedPropertyTypes.length === 0) return "Any";

  if (selectedPropertyTypes.length === 1) {
    return formatPropertyType(selectedPropertyTypes[0]);
  }

  return `${selectedPropertyTypes.length} selected`;
};

const PropertyTypesDropdown = ({
  onClear,
  onToggle,
  propertyTypes,
  selectedPropertyTypes,
}) => (
  <Dropdown className="property-filter" autoClose="outside">
    <Dropdown.Toggle
      type="button"
      variant="outline-secondary"
      className="property-filter-toggle"
    >
      {getPropertyTypeLabel(selectedPropertyTypes)}
    </Dropdown.Toggle>

    <Dropdown.Menu className="property-filter-menu">
      <div className="property-filter-actions">
        <Button type="button" variant="link" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>

      {propertyTypes.map((propertyType) => (
        <Form.Check
          key={propertyType}
          id={`property-type-${propertyType}`}
          type="checkbox"
          className="property-filter-check"
          label={formatPropertyType(propertyType)}
          checked={selectedPropertyTypes.includes(propertyType)}
          onChange={() => onToggle(propertyType)}
        />
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default PropertyTypesDropdown;
