import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { register } from "../api/auth"; // путь к auth.ts
import { useState } from "react";

interface RegisterProps {
  onRegister: (token: string) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await register({ email, password});
      onRegister(data.token);
      navigate("dashboard/profile");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Register</h2>
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
            placeholder="Enter a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            required
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
          <button type="submit">Register</button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
