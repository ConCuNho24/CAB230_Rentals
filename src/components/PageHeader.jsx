import { Badge } from "react-bootstrap";

const PageHeader = ({ badgeText, subtitle, title }) => (
  <div className="page-hero compact">
    <div>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </div>
    <Badge bg="secondary">{badgeText}</Badge>
  </div>
);

export default PageHeader;
