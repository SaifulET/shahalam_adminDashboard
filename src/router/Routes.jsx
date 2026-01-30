import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import ForgatePassword from "../Pages/Auth/ForgatePassword/ForgatePassword";
import AboutUs from "../Pages/Settings/AboutUS/AboutUs";
import PrivacyPolicy from "../Pages/Settings/PrivacyPolicy/PrivacyPolicy";
import TermsCondition from "../Pages/Settings/TermsCondition/TermsCondition";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProfilePage from "../Pages/AdminProfile/ProfilePage";
import VerifyCode from "../Pages/Auth/VerifyCode/VerifyCode";
import NewPass from "../Pages/Auth/NewPass/NewPass";
import Notifications from "../Pages/Notifications/Notifications";
import AnalysisPage from "../Pages/Analysis/AnalysisPage";
import Subscriptions from "../Pages/Subscriptions/Subscriptions";
import Analysis from "../Pages/Analysis/Analysis";
import RestaurantRequest from "../Pages/RestaurantRequest/RestaurantRequest";
import UserList from "../Pages/UserList/UserList";
import Earnings from "../Pages/Earnings/Earnings";
import Categories from "../Pages/Categories/Categories";
import Reports from "../Pages/Reports/Reports";
import Settings from "../Pages/Settings/Settings";
import AllMessages from "../Pages/Messages/AllMessages";
import BlockedList from "../Pages/BlockedList/BlockedList";
import ChangePass from "../Pages/AdminProfile/ChangePass";
import AdsSetup from "../Pages/AdsSetup/AdsSetup";
import ActivityEvents from "../Pages/Activity & Events/ActivityEvents";
import AdminSignIn from "../Pages/SuperAdminAuth/Auth/SignIn/SignIn"
import AdminForgatePassword from "../Pages/SuperAdminAuth/Auth/ForgatePassword/ForgatePassword"
import AdminVerifyCode from "../Pages/SuperAdminAuth/Auth/VerifyCode/VerifyCode"
import AdminNewPass from "../Pages/SuperAdminAuth/Auth/NewPass/NewPass"
import AdminDashboard from "../Pages/SuperAdminAuth/Dashboard/Dashboard/Dashboard";

import AddEmployee from "../Pages/AddEmployee/AddEmployee";
import ProjectTable from "../Pages/Project/Project";
import BuildingFloorLayout from "../Pages/ProjectDetails/ProjectDetails";
import ForgotPassword from "../Pages/Settings/ForgetPassword/ForgetPassword";
import EmailVerification from "../Pages/Settings/OTP/EmailVerification";
import AdminManagementPage from "../Pages/Admin/Admin";
import AdminList from "../Pages/SuperAdminAuth/Dashboard/AdminList/AdminList";
import AdminBlockedList from "../Pages/SuperAdminAuth/AdminBlockedList/AdminBlockedList";
import AdminSettings from "../Pages/SuperAdminAuth/Dashboard/Settings";
import ChangePassword from "../Pages/AdminProfile/ChangePass";
import AdminForgotPassword from "../Pages/SuperAdminAuth/ForgetPassword/ForgetPassword";
import AdminRoute from "./AdminRoute";
import AdminMainLayout from "../Pages/SuperAdminAuth/Main";
import AdminEmailVerification from "../Pages/SuperAdminAuth/OTP/EmailVerification";
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
    path: "/admin/sign-in",
    element: <AdminSignIn />,
  },
  {
    path: "/admin/forgate-password",
    element: <AdminForgatePassword />,
  },
  {
    path: "/admin/verify-code",
    element: <AdminVerifyCode />,
  },
  {
    path: "/admin/new-password",
    element: <AdminNewPass />,
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

          { path: "/earnings", element: <Earnings /> },
          { path: "/restaurant-request", element: <RestaurantRequest /> },
          { path: "/analysis-page", element: <AnalysisPage /> },
          { path: "/analysis/:id", element: <Analysis /> },
          { path: "/subscriptions", element: <Subscriptions /> },
          { path: "/categories", element: <Categories /> },
          { path: "/reports", element: <Reports /> },
          { path: "/ads-setup", element: <AdsSetup /> },
            { path: "/activity&events", element: <ActivityEvents /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/settings", element: <Settings /> },
         
          { path: "/settings/profile", element: <ProfilePage /> },
          { path: "/settings/change-password", element: <ChangePass /> },
        
          { path: "/settings/forget-password", element: <ForgotPassword /> },
         
          { path: "/settings/email-verification", element: <EmailVerification /> },
          { path: "/messages", element: <AllMessages /> },
    
        ],
      },
    ],
  },
 {
  element: <AdminRoute />,
  children: [
    {
      path: "/admin",
      element: <AdminMainLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "admin", element: <AdminList /> },
        { path: "add-admin", element: <AddEmployee /> },
        { path: "block-list", element: <AdminBlockedList /> },

        { path: "settings", element: <AdminSettings /> },
        { path: "settings/forget-password", element: <AdminForgotPassword /> },
        { path: "settings/change-password", element: <ChangePassword /> },
        { path: "settings/email-verification", element: <AdminEmailVerification /> },

      ],
    },
  ],
}

]);
