import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";

function EditProfile() {
  const { user, updateUser } = useAuthStore();
   const login = useAuthStore((state) => state.login);
   console.log(user)
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    number: user.phone,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.patch(`/auth/${user.id}`, {
        name: userData.name,
        email: userData.email,
        phone: userData.number
      });

   
       const userDatas = response.data.data;
       

        // update auth store
        login({
          id: userDatas._id,
          name: userDatas.name,
          email: userDatas.email,
          phone: userDatas.phone,
          profileImage: userDatas.profileImage,
        
        });

      // Update the user data in the auth store
      if (updateUser) {
        updateUser(response.data.user);
      }

      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-5 text-2xl font-bold text-center text-black">
        Edit Your Profile
      </p>

      {/* Message display */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-auto md:w-[480px]">
        <div>
          <label className="mb-2 text-xl font-bold text-black">
            User Name
          </label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="w-full px-5 py-3 text-[#5C5C5C] bg-white border-2 border-white rounded-md outline-none placeholder:text-xl"
            placeholder="Enter full name"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-black">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="w-full px-5 py-3 mt-5 text-[#5C5C5C] bg-white border-2 border-white rounded-md placeholder:text-xl"
            placeholder="Enter Email"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold text-black">
            Contact No
          </label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={userData.number}
            name="number"
            onChange={handleInputChange}
            placeholder="Contact No"
            className="w-full px-5 py-3 mt-5 text-[#5C5C5C] bg-white border-2 border-white rounded-md placeholder:text-xl"
            required
            disabled={isLoading}
          />
        </div>

        <div className="py-3 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#71abe0] text-white font-semibold w-full py-2 rounded-lg transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5f96c9]'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;