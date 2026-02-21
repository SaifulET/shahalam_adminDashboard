import React from "react";
import { Link,  } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bell, MessageSquareMore } from "lucide-react";
import adminImage from "../../../assets/image/adminkickclick.jpg";

const AdminHeader = ({ showDrawer }) => {
  
  
 
  

  const adminProfile = {
    name: "James",
    role: "admin",
  };

 

  

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
              Welcome, {adminProfile.name}
            </h2>
            <p className="text-sm text-gray-500">Have a nice day!</p>
          </div>
        </div>

        {/* =============================Right Section============================= */}
        <div className="flex items-center gap-4">
          {/* Message Icon */}
         


          {/* Profile Icon */}
          <Link to="/admin/settings/profile" >
          <div className="p-2 text-blue-700 transition border border-blue-500 rounded-full hover:bg-blue-50">
            <img
              src={adminImage}
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

export default AdminHeader;
