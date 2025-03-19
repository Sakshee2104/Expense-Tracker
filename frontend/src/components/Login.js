import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../Auth.css";

// Configure axios defaults
axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Log the data being sent
      console.log("Sending login request with:", { email, password });

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: email.trim(),
          password: password.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Login response:", response.data);

      if (response.data.token) {
        login(response.data.token);
        window.location.reload(); // Reload the page after successful login
      } else {
        setError("Login failed - no token received");
      }
    } catch (error) {
      console.error("Login error details:", error.response?.data);
      setError(
        error.response?.data?.message || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin} className="auth-form">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
