import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login if no token
      navigate('/admin/login');
      return;
    }

    // Basic token validation (check if it's a valid JWT format)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem('token');
        navigate('/admin/login');
        return;
      }
    } catch (error) {
      // Invalid token format
      localStorage.removeItem('token');
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const token = localStorage.getItem('token');
  
  if (!token) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  return <>{children}</>;
};

export default AuthCheck;