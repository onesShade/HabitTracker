// Profile.tsx
import { useEffect, useState } from "react";
import { getCurrentUser, logout, deleteAccount } from "../api/auth";
import type { User } from "../api/auth";
import * as FaIcons from "react-icons/fa";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      window.location.href = "/login";
    }
  };

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm("Are you absolutely sure? This action cannot be undone!");
    const confirm2 = confirm1 && window.confirm("This will permanently delete your account and all your data. This action cannot be reversed!");
    
    if (confirm1 && confirm2) {
      try {
        await deleteAccount();
        window.location.href = "/login";
      } catch (err) {
        alert("Failed to delete account: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">User not found</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {getInitials(user.email)}
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {user.displayName || user.email.split('@')[0]}
            </h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-meta">
              <span className="meta-item">
                <FaIcons.FaCalendar className="meta-icon" />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="meta-item">
                <FaIcons.FaCheckCircle className="meta-icon" />
                {user.enabled ? "Verified" : "Pending verification"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Active Habits</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Total Streaks</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="action-btn logout-btn"
            onClick={handleLogout}
          >
            <FaIcons.FaSignOutAlt />
            Log Out
          </button>
          
          <button 
            className="action-btn delete-btn"
            onClick={handleDeleteAccount}
          >
            <FaIcons.FaTrash />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}