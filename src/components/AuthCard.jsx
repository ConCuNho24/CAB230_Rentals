import { Card, Col, Container, Row } from "react-bootstrap";

import houseLogo from "../assets/HouseLogo.png";
import "./AuthCard.css";

const AuthCard = ({ children, subtitle, title }) => (
  <Container className="auth-page auth-card-page">
    <Row className="justify-content-center w-100">
      <Col xl={4} lg={5} md={7}>
        <Card className="app-card auth-card">
          <Card.Body>
            <div className="auth-card-header">
              <div className="auth-card-icon">
                <img src={houseLogo} alt="RENFIN logo" />
              </div>
              <div>
                <p className="auth-brand-name">RENFIN</p>
                <h1 className="section-title">{title}</h1>
                <p className="muted-text">{subtitle}</p>
              </div>
            </div>

            {children}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default AuthCard;
