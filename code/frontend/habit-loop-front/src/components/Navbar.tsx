import { Link } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Habit Loop </div>
      <div className="navbar-links">
        <Link to="/dashboard/habits">Habits</Link>
        <Link to="/dashboard/goals">Goals</Link>
        <Link to="/dashboard/calendar">Calendar</Link>
        <Link to="/dashboard/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
