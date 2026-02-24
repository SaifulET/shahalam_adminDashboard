import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();


  if (!isAuthenticated) {
    return <Navigate to="/admin/sign-in" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

