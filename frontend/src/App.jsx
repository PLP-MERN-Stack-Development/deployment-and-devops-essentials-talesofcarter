import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { authService } from "./services/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setLoading(false);
    }, 0);
  }, []);

  // Login handler
  const handleLogin = async (email, password) => {
    const { token } = await authService.login(email, password);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Register handler
  const handleRegister = async (email, password) => {
    const { token } = await authService.register(email, password);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Authenticated: Show Dashboard
  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Not authenticated: Show Login or Register
  return showLogin ? (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setShowLogin(false)}
    />
  ) : (
    <Register
      onRegister={handleRegister}
      onSwitchToLogin={() => setShowLogin(true)}
    />
  );
}

export default App;
