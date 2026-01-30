import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = localStorage.getItem("admin");
//   JSON.parse(localStorage.getItem("user"));
console.log(user)
  // Not logged in
//   if (!user) {
//     return <Navigate to="/sign-in" replace />;
//   }

  // Logged in but not admin
//   if (user.role !== "admin") {
//     return <Navigate to="/unauthorized" replace />;
//   }

  // Admin access granted
  return <Outlet />;
};

export default AdminRoute;
