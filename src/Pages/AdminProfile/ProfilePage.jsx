import { useState } from "react";
import { LuPenLine } from "react-icons/lu";
import { Link } from "react-router-dom";
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import Profile from "./Profile";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("/settings/profile");
  const [profilePic, setProfilePic] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  


  const getTabTitle = () => {
    switch (activeTab) {
      case "/settings/profile":
        return "Profile";
      case "/settings/editProfile":
        return "Edit Profile";
      case "/settings/changePassword":
        return "Change Password";
      default:
        return "";
    }
  };

  // ✅ IMAGE UPLOAD FUNCTION
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if user exists and has id
    if (!user || !user.id) {
      console.error("User not found or user ID is missing");
      return;
    }

    try {
      setIsUploading(true);
      
      // Show preview instantly
      setProfilePic(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("image", file); // 👈 backend field name must be "image"

      const res = await api.patch(`/auth/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update global auth store with the response data
      if (res.data && res.data.data) {
        login(res.data.data);
      }

    } catch (error) {
      console.error("Image upload failed:", error);
      // Optionally revert the preview if upload fails
      setProfilePic(null);
    } finally {
      setIsUploading(false);
    }
  };

  // If user is not loaded yet, show loading state
  if (!user) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="mx-auto mt-16 bg-white rounded-xl"
      >
        {/* Header */}
        <div className="bg-[#71abe0] p-5 rounded-t-xl text-white">
          <Link to="/" className="px-10 text-3xl font-bold">
            {getTabTitle()}
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center mx-auto">
          {/* Profile Picture */}
          <div className="mt-10">
            <div className="w-[122px] relative h-[122px] mx-auto rounded-full border-4 shadow-xl flex justify-center items-center">
              <img
                src={
                  profilePic || // Preview image takes priority
                  user?.profileImage || // Then user's profile image from store
                  "/profile.jpg" // Finally default image
                }
                alt="profile"
                className="w-32 h-32 rounded-full object-cover"
              />

              <div className={`absolute right-0 p-2 bg-white rounded-full shadow-md cursor-pointer bottom-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <label htmlFor="profilePicUpload" className="cursor-pointer">
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    <LuPenLine />
                  )}
                </label>
                <input
                  type="file"
                  id="profilePicUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-5 my-5 font-semibold text-md md:text-xl">
            <p
              onClick={() => setActiveTab("/settings/profile")}
              className={`cursor-pointer pb-1 ${
                activeTab === "/settings/profile"
                  ? "border-b-2 border-[#319FCA] text-[#319FCA]"
                  : ""
              }`}
            >
              Profile
            </p>

            <p
              onClick={() => setActiveTab("/settings/editProfile")}
              className={`cursor-pointer pb-1 ${
                activeTab === "/settings/editProfile"
                  ? "border-b-2 border-[#319FCA] text-[#319FCA]"
                  : ""
              }`}
            >
              Edit Profile
            </p>
          </div>

          {/* Tab Content */}
          <div className="flex items-center justify-center p-5 rounded-md w-full">
            <div className="flex item-center justify-center">
              {activeTab === "/settings/profile" && (
                <Profile setActiveTab={setActiveTab} />
              )}

              {activeTab === "/settings/editProfile" && <EditProfile />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;