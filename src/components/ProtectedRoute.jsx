import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/authStore";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the requested page so Login can redirect back after success.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
