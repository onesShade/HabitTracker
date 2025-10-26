import { useNavigate } from "react-router-dom";

const AuthChoice = () => {
  const navigate = useNavigate();
  return (
    <div className="center-container">
      <div className="auth-box">
        <h2>Welcome to HabitTracker</h2>
        <p>Track your goals and build better habits.</p>
        <div className="btn-group">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
