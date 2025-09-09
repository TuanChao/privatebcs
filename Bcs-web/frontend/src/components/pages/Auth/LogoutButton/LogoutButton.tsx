import { useState } from "react";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/Manage/logout", { 
        method: "POST",
        credentials: "include" 
      });
      
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("isAdminLoggedIn");
      
      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="logout-btn" 
      onClick={handleLogout}
      disabled={loading}
      title="Đăng xuất"
    >
      <i className="bi bi-box-arrow-right logout-icon"></i>
      <span className="logout-text">
        {loading ? "Đang đăng xuất..." : "Đăng xuất"}
      </span>
    </button>
  );
};

export default LogoutButton;