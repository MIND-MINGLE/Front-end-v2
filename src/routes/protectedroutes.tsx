import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AccountProps } from "../interface/IAccount";
// Function to check if user is authenticated (modify as needed)
const isAuthenticated = (): boolean => {
  
  const user = localStorage.getItem("token"); // Example: Store user token or object
  if(!user){
    console.error("No account found");
    return false; 
  }
  else{
    var token = jwtDecode<AccountProps>(user||"");
    localStorage.setItem("account", JSON.stringify(token));
    console.log(token);
    return true; 
  }
};


// Protected Route Component
export default function ProtectedRoutes() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RoleProtectedRoute() {
  const data = localStorage.getItem("account");
  if (!data) {
    console.error("No account found in localStorage. DIRTY LITTLE HACKER");
    return null; // Handle missing account case. DIRTY LITTLE HACKER
  }

  try {
    const account:AccountProps = JSON.parse(data); // Convert string back to object
    return account.Role;
  } catch (error) {
    console.error("Error parsing account data:", error);
    return null;
  }
}
