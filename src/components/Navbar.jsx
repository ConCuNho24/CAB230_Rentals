import { Link } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";

export default function Navbar() {
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <BSNavbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          Rental App
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />

        <BSNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/rentals">
              Rental Search
            </Nav.Link>

            {token && (
              <Nav.Link as={Link} to="/rated">
                Rated Rentals
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {!token ? (
              <>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>

                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            ) : (
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}