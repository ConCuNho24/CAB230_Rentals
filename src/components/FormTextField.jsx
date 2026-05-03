import { Form } from "react-bootstrap";

const FormTextField = ({
  autoComplete,
  className = "mb-3",
  controlId,
  label,
  minLength,
  name,
  onChange,
  required = true,
  type = "text",
  value,
}) => (
  <Form.Group className={className} controlId={controlId}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      minLength={minLength}
      required={required}
    />
  </Form.Group>
);

export default FormTextField;
