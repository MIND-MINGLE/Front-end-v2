import { Navigate, Outlet } from "react-router-dom";

// Function to check if user is authenticated (modify as needed)
const isAuthenticated = (): boolean => {
  const user = localStorage.getItem("user"); // Example: Store user token or object
  return user !== null; // Adjust based on how you store authentication
};

// Protected Route Component
export default function ProtectedRoutes() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
