import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";

import { useAuth } from "../context/authStore";
import logo from "../assets/HouseLogo.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { email, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <BSNavbar expand="lg" className="app-navbar">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="brand-logo">
          <img src={logo} alt="RENFIN logo" className="logo-img" />
          <span className="brand-name">RENFIN</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />

        <BSNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/rentals">
              Rental Search
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/rated">
                Rated Rentals
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>

                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
              </>
            ) : (
              <>
                <span className="navbar-user">{email}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
