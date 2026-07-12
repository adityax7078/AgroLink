import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem('user');
  let isAuthenticated = false;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Verify token exists and is non-empty
      if (user && user.token) {
        isAuthenticated = true;
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
