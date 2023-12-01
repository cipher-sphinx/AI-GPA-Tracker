import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const useAuth = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get("http://localhost:2000/protectedRoute", {
      withCredentials: true,
    }).then((response) => {
      const userType = response.data.userType;
      const userId = response.data.id;
      console.log(response.data, "PLUH");

      let dashboardUrl;
      switch (userType) {
      case "student":
        dashboardUrl = `/dashboard/${userId}`;
        break;
      case "staff":
        dashboardUrl = `/dashboard/staff/${userId}`;
        break;
      case "admin":
        dashboardUrl = `/dashboard/admin/${userId}`;
        break;
      default:
        throw new Error(`Unexpected user type: ${userType}`);
      }

      // If successful and we're at the login page, navigate to the dashboard
      if (location.pathname === "/login") {
        navigate(dashboardUrl, { replace: true });
      }
      // Successfully validated token, no need to do anything
    }).catch(() => {
      // Failed to validate token
      // If we are not on the login page, redirect to login
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate, location.pathname]); // Add location.pathname to the dependency array

  return children;
};

export default useAuth;
