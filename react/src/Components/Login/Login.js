import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS for styling

function Login() {
  const [user, setUser] = useState(""); // State for username
  const [pass, setPass] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error message
  const nav = useNavigate(); // Navigate to other pages

  // Handle form submission
  const submit = async (event) => {
    event.preventDefault();

    // Check if username or password are empty
    if (!user || !pass) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      // Send the request to the backend to validate the login credentials
      const response = await axios.get(
        `http://localhost:8080/validate/${user}/${pass}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the backend returns true for valid credentials
      if (response.data === true) {
        alert("Login successful");
        nav("/Home"); // Navigate to Home page after successful login
      } else {
        setError("Wrong Credentials. Please try again.");
      }
    } catch (e) {
      nav("/Home");
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="gh" >
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div className="input-group">
            <label htmlFor="user">Username:</label>
            <input
              type="text"
              id="user"
              placeholder="Enter your username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="pass">Password:</label>
            <input
              type="password"
              id="user"
              placeholder="Enter your password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit">Login</button>
        </form>

        <div className="footer-links">
          <p>
            New here? <a href="/register">Register here</a>
          </p>
          <p>
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
