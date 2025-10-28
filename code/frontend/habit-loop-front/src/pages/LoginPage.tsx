import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { login } from "../api/auth"; // путь к auth.ts
import { useState } from "react";

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ email, password });
      onLogin(data.token);
      navigate("/dashboard/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div className="auth-footer">
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
