import { FiLogOut } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import brandlogo from "../../../assets/image/logo.svg";
import {
  Settings, 
  Users,
} from "lucide-react";

import { IoPersonAddSharp } from "react-icons/io5";
import { AiOutlineCluster } from "react-icons/ai";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: <MdDashboard className="w-5 h-5" />,
      label: "Dashboard",
      Link: "/admin/Dashboard",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Admin",
      Link: "/admin/admin",
    },
    
    {
      icon: <IoPersonAddSharp 
 className="w-5 h-5" />,
      label: "Add Admin",
      Link: "/admin/add-admin",
    },
   
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      Link: "/admin/settings",
    },
  ];

  return (
    <div className="flex flex-col h-auto p-3 w-72">
      <div className="mx-auto">
        <img src={brandlogo} alt="logo" className="w-40 h-40" />
      </div>

      <div className="flex-1 text-center  justify-center  w-full ">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.Link;

          return (
            <div key={item.label}>
              <div
                className={`flex justify-center text-center items-center px-5 py-2 my-5 cursor-pointer transition-all  hover:rounded-md hover:bg-[#0088FF] hover:text-white hover:font-semibold ${
                  isActive
                    ? "bg-[#0088FF] text-white font-semibold"
                    : "text-black"
                }`}
              >
                <Link to={item.Link} className="flex items-center w-full gap-3">
                  {item.icon}
                  <p>{item.label}</p>
                  {item.isDropdown && (
                    <BiChevronDown
                      className={`${isActive ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

     
    </div>
  );
};

export default Sidebar;
