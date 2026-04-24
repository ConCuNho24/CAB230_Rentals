import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// components
import Navbar from "./components/Navbar";

// pages
import Home from "./pages/Home";
import RentalSearch from "./pages/RentalSearch";
import RentalDetail from "./pages/RentalDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RatedRentals from "./pages/RatedRentals";

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: "rentals", Component: RentalSearch },
      { path: "rentals/:id", Component: RentalDetail },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "rated", Component: RatedRentals },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}