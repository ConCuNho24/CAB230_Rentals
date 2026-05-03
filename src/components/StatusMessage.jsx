import { Alert, Spinner } from "react-bootstrap";

import "./StatusMessage.css";

export const LoadingMessage = ({ message = "Loading..." }) => (
  <div className="status-message" role="status">
    <Spinner animation="border" size="sm" />
    <span>{message}</span>
  </div>
);

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return <Alert variant="danger">{message}</Alert>;
};
