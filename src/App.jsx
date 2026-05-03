import { BrowserRouter, Route, Routes } from "react-router-dom";

// components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthProvider";

// pages
import Home from "./pages/Home";
import RentalSearch from "./pages/RentalSearch";
import RentalDetail from "./pages/RentalDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RatedRentals from "./pages/RatedRentals";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rentals" element={<RentalSearch />} />
          <Route path="/rentals/:id" element={<RentalDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/rated" element={<RatedRentals />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
