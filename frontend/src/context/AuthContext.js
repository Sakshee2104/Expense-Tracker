import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decodedUser);
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } catch (error) {
      console.error("Error during login:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload(); // Reload the page after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
