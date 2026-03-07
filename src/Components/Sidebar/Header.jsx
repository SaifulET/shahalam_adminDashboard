import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bell, LogOut, MessageSquareMore } from "lucide-react";
import adminImage from "../../assets/image/adminkickclick.jpg";
import { useAuthStore } from "../../store/authStore";
import { useI18n } from "../../i18n/I18nProvider";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import api from "../../lib/api";

const Header = ({ showDrawer }) => {
 const user = useAuthStore().user
 const logout = useAuthStore((state) => state.logout)
 const navigate = useNavigate()
 const { t } = useI18n();

 const adminProfile = {
    name: user?.name || t("header.userFallback"),
    role: "admin",
    profile: user?.profileImage || adminImage,
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      logout()
      navigate("/sign-in", { replace: true })
    }
  }

  

  return (
    <div className="relative mt-2">
      <div
       
        className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-md"
      >
        {/*============================= Left Section============================= */}
        <div className="flex items-center gap-4">
          <RxHamburgerMenu
            className="text-2xl text-blue-800 cursor-pointer lg:hidden"
            onClick={showDrawer}
          />
          <div>
            <h2 className="font-semibold text-gray-800 text-md">
              {t("header.welcome", { name: adminProfile.name })}
            </h2>
            <p className="text-sm text-gray-500">{t("header.haveNiceDay")}</p>
          </div>
        </div>

        {/* =============================Right Section============================= */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {/* Message Icon */}
         

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 transition border border-red-500 rounded-full hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          {/* Profile Icon */}
          <Link to="/settings/profile" >
          <div className="p-2 text-blue-700 transition border border-blue-500 rounded-full hover:bg-blue-50">
            <img
              src={adminProfile.profile}
              alt="Admin"
              className="object-cover w-5 h-5 rounded-full"
            />
          </div>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Header;
