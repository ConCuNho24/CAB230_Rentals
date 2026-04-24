import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import RentalSearch from "./pages/RentalSearch";
import RentalDetail from "./pages/RentalDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RatedRentals from "./pages/RatedRentals";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rentals" element={<RentalSearch />} />
          <Route path="/rentals/:id" element={<RentalDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rated" element={<RatedRentals />} />
        </Routes>
      </main>
    </>
  );
}