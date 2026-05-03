import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";

import AuthCard from "../components/AuthCard";
import FormTextField from "../components/FormTextField";
import { useAuth } from "../context/authStore";

const Register = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Confirm on the client before sending the registration request.
    if (credentials.password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await register(credentials);
      navigate("/login", {
        state: {
          message: "Account created. You can now log in.",
          email: credentials.email,
        },
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Register to save ratings against rental properties."
    >
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="auth-form">
        <FormTextField
          controlId="register-email"
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <FormTextField
          controlId="register-password"
          label="Password"
          name="password"
          type="password"
          minLength={8}
          value={credentials.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <Form.Group className="mb-4" controlId="register-confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={isSubmitting} className="w-100 auth-button">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </Form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </AuthCard>
  );
};

export default Register;
