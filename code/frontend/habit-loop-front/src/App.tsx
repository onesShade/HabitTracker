import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const handleLogin = (fakeToken: string) => {
    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
  };


  return (
    <Router>
      {token ? (
        <>
          <Navbar/>
          <div className="page-container">
            <Routes>
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route
              path="/demo"
              element={
                <>
                  <Navbar />
                  <div className="page-container">
                    <Dashboard />
                  </div>
                </>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;