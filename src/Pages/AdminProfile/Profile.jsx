import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";

function Profile({ setActiveTab }) {
  const user = useAuthStore().user;
  const login = useAuthStore((state) => state.login);

  

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        const res = await api.get(`/auth/${user.id}`);
        const userData = res.data.data;

       

        // update auth store
        login({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          profileImage: userData.profileImage,
        
        });

      } catch (error) {
        console.error(error);
      }
    })();
  }, [user?.id, login]);

  return (
    <div>
      <p className="mb-5 text-2xl font-bold text-center">
        Your Profile
      </p>

      <form className="space-y-2 w-auto md:w-[480px]">
        <div>
          <label className="mb-2 text-xl font-bold">User Name</label>
          <input
            type="text"
            value={user?.name}
            className="w-full px-5 py-3 mt-5 rounded-md outline-none"
            disabled
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold">Email</label>
          <input
            type="email"
            value={user?.email}
            className="w-full px-5 py-3 mt-5 rounded-md outline-none"
            disabled
          />
        </div>

        <div>
          <label className="mb-2 text-xl font-bold">Contact No</label>
          <input
            type="number"
            value={user?.phone}
            className="w-full px-5 py-3 mt-5 rounded-md outline-none"
            disabled
          />
        </div>

        <div className="py-3 text-center">
          <button
            type="button"
            onClick={() => setActiveTab("/settings/editProfile")}
            className="bg-[#71abe0] text-white font-semibold w-full py-2 rounded-lg"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
