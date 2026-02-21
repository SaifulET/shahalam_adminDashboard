import { useEffect, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { VscDebugRestart } from "react-icons/vsc";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/api";


const BlockedList = () => {
  const {user}=useAuthStore()
  console.log("Current User:", user);
  const userId = user.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const usersPerPage = 8;

  // ================= FETCH BLOCKED EMPLOYEES =================
  const fetchBlockedEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/employees/allblockedemployee/${userId}`
      );
      setUsers(data?.data || []);
    } catch (error) {
      console.error("Fetch blocked employees error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedEmployees();
  }, [userId]);

  // ================= FILTER + PAGINATION =================
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // ================= VIEW DETAILS =================
  const handleViewUser = async (employeeId) => {
    try {
      const { data } = await api.get(`/employees/${employeeId}`);
      setSelectedUser(data?.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Fetch employee details error:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // ================= UNBLOCK =================
  const handleBanUser = (user) => {
    setUserToBlock(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    try {
      await api.patch(`/employees/${userToBlock}`, {
        status: "active",
      });

      setIsConfirmModalOpen(false);
      setUserToBlock(null);
      fetchBlockedEmployees();
    } catch (error) {
      console.error("Unblock employee error:", error);
    }
  };

  const handleCancelBlock = () => {
    setIsConfirmModalOpen(false);
    setUserToBlock(null);
  };

  return (
    <div className="min-h-screen py-4 bg-gray-50">
      <div className="mx-auto mt-16">
        {/* Header */}
        <div className="px-6 py-4 mb-6 bg-[#71ABE0] rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              Blocked Employees
            </h1>

            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search User"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 py-2 pl-10 pr-4 text-sm bg-white border-0 rounded-lg focus:ring-2 focus:ring-cyan-300"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    S.ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center">
                      No blocked employee found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        {new Date(user.joiningDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBanUser(user._id)}
                            className="p-1 text-[#71ABE0]"
                          >
                            <VscDebugRestart size={18} />
                          </button>

                          <button
                            onClick={() => handleViewUser(user._id)}
                            className="p-1 text-[#71ABE0]"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="flex justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-[#71ABE0]">
                Employee Details
              </h2>
              <button onClick={handleCloseModal}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p><b>Name:</b> {selectedUser.name}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Phone:</b> {selectedUser.phone}</p>
              <p><b>Status:</b> {selectedUser.status}</p>
              <p>
                <b>Joined:</b>{" "}
                {new Date(selectedUser.joiningDate).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-[#71ABE0] mb-4">
                Unblock Employee?
              </h3>
              <p className="mb-6">
                Are you sure you want to unblock{" "}
                <b>{userToBlock.name}</b>?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleCancelBlock}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmBlock}
                  className="flex-1 bg-[#71ABE0] text-white rounded-lg py-2"
                >
                  Yes, Unblock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedList;