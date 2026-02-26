import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";

const PrivateRoute = () => {
  const { isAuthenticated, loading, login, logout } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      if (isAuthenticated) {
        if (isMounted) setCheckingAuth(false);
        return;
      }

      try {
        const res = await api.post("/auth/refresh");
        const { user, accessToken } = res.data || {};

        if (user && accessToken) {
          login(user, accessToken);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, login, logout]);

  if (checkingAuth || loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
