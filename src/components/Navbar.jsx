import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/rentals">Rental Search</Link>

      {token && <Link to="/rated">Rated Rentals</Link>}

      {!token ? (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Log Out</button>
      )}
    </nav>
  );
}