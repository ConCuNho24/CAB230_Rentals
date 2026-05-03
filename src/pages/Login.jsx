import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";

import AuthCard from "../components/AuthCard";
import FormTextField from "../components/FormTextField";
import { useAuth } from "../context/authStore";

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ProtectedRoute stores the original destination in location.state.from.
  const redirectTo = location.state?.from || "/rentals";
  const registerMessage = location.state?.message;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await login(credentials);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Login to rate rentals and manage your saved activity."
    >
      {registerMessage && <Alert variant="success">{registerMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="auth-form">
        <FormTextField
          controlId="login-email"
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <FormTextField
          className="mb-4"
          controlId="login-password"
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <Button type="submit" disabled={isSubmitting} className="w-100 auth-button">
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </Form>

      <p className="auth-switch">
        New user? <Link to="/register">Create an account</Link>
      </p>
    </AuthCard>
  );
};

export default Login;
