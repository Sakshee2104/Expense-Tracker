import React, { useState } from "react";
import axios from "axios";
import "../Auth.css";// Import the CSS file

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      alert(response.data.message);
      // Clear form after successful signup
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSignup} className="auth-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password (min. 6 characters)" 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value.length > 0 && e.target.value.length < 6) {
              setError("Password must be at least 6 characters long");
            } else {
              setError("");
            }
          }}
          required
          minLength={6}
        />
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading || password.length < 6}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
