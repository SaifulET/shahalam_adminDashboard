import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import ForgatePassword from "../Pages/Auth/ForgatePassword/ForgatePassword";

import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProfilePage from "../Pages/AdminProfile/ProfilePage";
import VerifyCode from "../Pages/Auth/VerifyCode/VerifyCode";
import NewPass from "../Pages/Auth/NewPass/NewPass";


import Settings from "../Pages/Settings/Settings";
import BlockedList from "../Pages/BlockedList/BlockedList";
import ChangePass from "../Pages/AdminProfile/ChangePass";

import AddEmployee from "../Pages/AddEmployee/AddEmployee";
import ProjectTable from "../Pages/Project/Project";
import BuildingFloorLayout from "../Pages/ProjectDetails/ProjectDetails";
import ForgotPassword from "../Pages/Settings/ForgetPassword/ForgetPassword";
import EmailVerification from "../Pages/Settings/OTP/EmailVerification";
export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/forgate-password",
    element: <ForgatePassword />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
  },
  {
    path: "/new-password",
    element: <NewPass />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/employee", element: <UserList /> },
          { path: "/project", element: <ProjectTable /> },
          { path: "/add-employee", element: <AddEmployee /> },
          { path: "/block-list", element: <BlockedList /> },
          { path: "/project/:id", element: <BuildingFloorLayout /> },

         
          { path: "/settings", element: <Settings /> },
       
          { path: "/settings/profile", element: <ProfilePage /> },
          { path: "/settings/change-password", element: <ChangePass /> },
          { path: "/settings/forget-password", element: <ForgotPassword /> },
          { path: "/settings/email-verification", element: <EmailVerification /> },
         
        ],
      },
    ],
  },
]);
